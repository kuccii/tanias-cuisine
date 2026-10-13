import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { menuSections, restaurantInfo } from "@/data/menu";
import { generateResponse } from "@/lib/menu-bot.server";

function buildMenuContext() {
  const lines: string[] = [];
  for (const s of menuSections) {
    lines.push(`\n### ${s.title} — ${s.subtitle}`);
    if (s.groups) {
      for (const g of s.groups) {
        lines.push(`  [${g.name}]`);
        for (const it of g.items)
          lines.push(
            `  - ${it.name} (${it.price})${it.description ? ` — ${it.description}` : ""}${it.note ? ` [${it.note}]` : ""}`,
          );
      }
    }
    if (s.items) {
      for (const it of s.items)
        lines.push(
          `  - ${it.name} (${it.price})${it.description ? ` — ${it.description}` : ""}${it.note ? ` [${it.note}]` : ""}`,
        );
    }
    if (s.special_box) {
      lines.push(`  [★ ${s.special_box.title}]`);
      for (const it of s.special_box.items)
        lines.push(`  - ${it.name} (${it.price})${it.note ? ` [${it.note}]` : ""}`);
    }
  }
  return lines.join("\n");
}

const SYSTEM_PROMPT = `You are "Aroma", the AI concierge for ${restaurantInfo.name} ${restaurantInfo.subtitle} — a Kigali-based restaurant since ${restaurantInfo.est} serving ${restaurantInfo.tagline.toLowerCase()}.

YOUR ROLE — be genuinely helpful to guests:
1. Recommend dishes based on cravings, dietary needs (vegetarian, no pork, spice level), budget, or occasion
2. Suggest food + drink pairings from our actual menu
3. Help guests plan a meal (starter + main + side + drink) within a budget
4. Answer questions about ingredients, preparation times, portion sizes, and prices
 5. Guide guests to make a reservation (point to /contact) or a catering inquiry (point to /catering). Note: we do not accept advance reservations for Thursdays — guests are welcome to walk in.
6. Share opening hours, location, and contact info

RESTAURANT FACTS:
- Parent company: Tany's Ltd (est. 2018)
- Launched: February 2020
- Location: M&M Plaza, Gishushu, Kigali, Rwanda
- Hours: Mon–Sun, 11:00 – 23:00. Daily buffet 12:00 – 15:00.
- Phone / WhatsApp: +250 789 289 450
- Email: hello@taniascuisine.rw (general) · info@taniascuisine.rw · events@taniascuisine.rw (catering)
- All prices in Rwandan Francs (FRW), taxes included.
- Guest capacity: up to 1,000 guests per event
- Key clients: Access Bank, The New Times, SONARWA, GIZ, Vivo Energy/Engen Rwanda, Oxfam, Horizon Group, Bank of Kigali

STYLE:
- Warm, sophisticated, concise. Use markdown lists for recommendations.
- Always cite the dish name and price from the menu below. Never invent dishes.
- If asked something outside your scope (politics, unrelated topics), gently steer back to dining at Tania's.
- Keep replies under 180 words unless the guest asks for more detail.

CURRENT MENU:
${buildMenuContext()}
`;

// ---------------------------------------------------------------------------
// Endpoint hardening
// ---------------------------------------------------------------------------

/** Reject oversized payloads before JSON parsing (memory-exhaustion guard). */
const MAX_BODY_BYTES = 64 * 1024; // 64 KB — chat messages never need more

/** Sliding-window rate limit per client. */
const RATE_LIMIT_MAX = 20; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute
const MAX_RATE_KEYS = 10_000; // bound memory even if client keys are spoofed
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

class PayloadTooLargeError extends Error {}

function clientKey(request: Request): string {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  // Evict expired entries, then oldest, so spoofed-key floods stay bounded.
  if (rateBuckets.size >= MAX_RATE_KEYS) {
    for (const [k, v] of rateBuckets) {
      if (v.resetAt <= now) rateBuckets.delete(k);
    }
    while (rateBuckets.size >= MAX_RATE_KEYS) {
      const oldest = rateBuckets.keys().next().value;
      if (oldest === undefined) break;
      rateBuckets.delete(oldest);
    }
  }
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

/**
 * Block cross-site browser requests. Browsers always send `Origin` on POST;
 * non-browser clients (curl, server-to-server) send none and are allowed here
 * (they are still bounded by the rate limit).
 */
function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("host");
  if (!host) return true;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** Read the request body while enforcing MAX_BODY_BYTES (Content-Length can be absent). */
async function readJsonWithLimit(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    throw new PayloadTooLargeError();
  }
  const body = request.body;
  if (!body) return request.json();
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      throw new PayloadTooLargeError();
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  return JSON.parse(text);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (isCrossOrigin(request)) {
          return new Response("Cross-origin requests are not allowed", { status: 403 });
        }
        if (isRateLimited(clientKey(request))) {
          return new Response("Too many requests. Please try again in a minute.", { status: 429 });
        }

        let payload: unknown;
        try {
          payload = await readJsonWithLimit(request);
        } catch (err) {
          if (err instanceof PayloadTooLargeError) {
            return new Response("Request too large", { status: 413 });
          }
          return new Response("Invalid JSON body", { status: 400 });
        }

        try {
          const { messages } = payload as { messages?: UIMessage[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("messages required", { status: 400 });
          }

          const key = process.env.NVIDIA_API_KEY;

          if (key) {
            const nvidia = createOpenAICompatible({
              name: "nvidia",
              baseURL: "https://integrate.api.nvidia.com/v1",
              apiKey: key,
            });
            const result = streamText({
              model: nvidia("meta/llama-3.1-70b-instruct"),
              system: SYSTEM_PROMPT,
              messages: await convertToModelMessages(messages),
            });
            return result.toUIMessageStreamResponse({ originalMessages: messages });
          }

          const last = messages[messages.length - 1];
          const text = last.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") || "";
          const response = generateResponse(text);

          const id = crypto.randomUUID();
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text-start", id })}\n\n`),
              );
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text-delta", id, delta: response })}\n\n`,
                ),
              );
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text-end", id })}\n\n`),
              );
              controller.close();
            },
          });

          return new Response(stream, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (err) {
          // Log internally; never echo raw provider errors to the client.
          const message = err instanceof Error ? err.message : "unknown error";
          console.error("[api/chat]", message);
          if (/402/.test(message))
            return new Response("Payment required. Check API billing.", { status: 402 });
          if (/429/.test(message))
            return new Response("Too many requests. Please try again shortly.", { status: 429 });
          return new Response("AI service is unavailable right now. Please try again shortly.", {
            status: 500,
          });
        }
      },
    },
  },
});
