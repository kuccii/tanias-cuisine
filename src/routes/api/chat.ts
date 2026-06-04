import { createFileRoute } from "@tanstack/react-router";
import { generateResponse } from "@/lib/menu-bot.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: { role: string; parts?: { type: string; text?: string }[] }[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("messages required", { status: 400 });
          }
          const last = messages[messages.length - 1];
          const text = last.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") || "";
          const response = generateResponse(text);

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(response));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (_err) {
          return new Response("Sorry, something went wrong. Please try again.", { status: 500 });
        }
      },
    },
  },
});
