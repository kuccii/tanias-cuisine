import { createFileRoute } from "@tanstack/react-router";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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
        for (const it of g.items) lines.push(`  - ${it.name} (${it.price})${it.description ? ` — ${it.description}` : ""}${it.note ? ` [${it.note}]` : ""}`);
      }
    }
    if (s.items) {
      for (const it of s.items) lines.push(`  - ${it.name} (${it.price})${it.description ? ` — ${it.description}` : ""}${it.note ? ` [${it.note}]` : ""}`);
    }
    if (s.special_box) {
      lines.push(`  [★ ${s.special_box.title}]`);
      for (const it of s.special_box.items) lines.push(`  - ${it.name} (${it.price})${it.note ? ` [${it.note}]` : ""}`);
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
5. Guide guests to make a reservation (point to /contact) or a catering inquiry (point to /catering)
6. Share opening hours, location, and contact info

RESTAURANT FACTS:
- Parent company: Tany's Ltd (est. 2018)
- Launched: February 2020
- Location: M&M Plaza, Gishushu, Kigali, Rwanda
- Hours: Mon–Sun, 11:00 – 23:00. Daily buffet 12:00 – 15:00.
- Phone / WhatsApp: +250 788 500 635
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

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: UIMessage[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("messages required", { status: 400 });
          }

          const key = process.env.GOOGLE_API_KEY;

          if (key) {
            const google = createGoogleGenerativeAI({ apiKey: key });
            const result = streamText({
              model: google("gemini-2.0-flash"),
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
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-start", id })}\n\n`));
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-delta", id, delta: response })}\n\n`));
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text-end", id })}\n\n`));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "unknown error";
          if (/402/.test(message)) return new Response("Payment required. Check API billing.", { status: 402 });
          if (/429/.test(message)) return new Response("Too many requests. Please try again shortly.", { status: 429 });
          return new Response(`AI error: ${message}`, { status: 500 });
        }
      },
    },
  },
});
