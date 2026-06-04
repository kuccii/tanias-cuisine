import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "What do you recommend for a first visit?",
  "I want a vegetarian meal under 20,000 FRW",
  "Best dish with a coffee pairing?",
  "Help me plan a catering for 30 guests",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, messages.length]);

  function submit(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    void sendMessage({ text: t });
    setInput("");
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu assistant" : "Open menu assistant"}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-[55] flex items-center gap-2 bg-primary text-primary-foreground rounded-full pl-4 pr-5 py-3 shadow-glow hover:scale-[1.03] transition-transform"
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span className="font-mono-display text-[10px] tracking-[0.22em] uppercase">
          {open ? "Close" : "Ask Aroma"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-3 bottom-32 lg:inset-x-auto lg:right-6 lg:bottom-24 lg:w-[420px] z-[54] bg-card border border-border shadow-2xl flex flex-col max-h-[78vh] lg:max-h-[640px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="border-b border-border/60 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg leading-none">Aroma</p>
              <p className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-foreground/55 mt-1.5">
                Menu concierge
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-foreground/60 hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Capabilities banner */}
          {messages.length === 0 && (
            <div className="px-4 py-3 border-b border-border/40 bg-primary/[0.04]">
              <p className="text-xs text-foreground/70 leading-relaxed">
                I know the full menu. Ask me for <span className="text-primary">recommendations</span>, dietary-friendly options,
                <span className="text-primary"> pairings</span>, catering ideas, or how to <span className="text-primary">reserve a table</span>.
              </p>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-foreground/45 mb-2">
                  Try asking
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="block w-full text-left text-sm border border-border/50 hover:border-primary hover:text-primary transition-colors px-3 py-2.5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 text-sm max-w-[85%] rounded-md">
                      {text}
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className="text-sm text-foreground/90 leading-relaxed prose-aroma">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              );
            })}

            {busy && messages[messages.length - 1]?.role === "user" && (
              <p className="text-xs text-foreground/50 italic">Aroma is thinking…</p>
            )}

            {error && (
              <p className="text-xs text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </p>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t border-border/60 p-3 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Ask about the menu, pairings, reservations…"
              className="flex-1 bg-background/50 border border-border/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none max-h-32"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="bg-primary text-primary-foreground p-2.5 disabled:opacity-40 hover:shadow-glow transition-shadow shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="px-3 pb-3 -mt-1 text-[10px] text-foreground/40 text-center">
            <MessageCircle size={9} className="inline" /> Knows our full menu · Ask me anything
          </p>
        </div>
      )}
    </>
  );
}
