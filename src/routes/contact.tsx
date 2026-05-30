import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { MapPin, Phone, Mail, Clock, MessageCircle, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Reservations — Tania's Cuisine & Lounge" },
      { name: "description", content: "Reserve a table, send a message, or reach us on WhatsApp. KG 9 Avenue, Kigali." },
      { property: "og:title", content: "Contact — Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Reserve a table or get in touch with our team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <SiteLayout>
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-6">Reserve · Reach Us</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Come <span className="italic text-primary">find us.</span>
          </h1>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-2 gap-12">
          {/* Form */}
          {sent ? (
            <div className="bg-card border border-primary/40 p-12 text-center flex flex-col justify-center">
              <Check className="text-primary mx-auto mb-6" size={40} />
              <h3 className="font-display text-3xl mb-3">Message received.</h3>
              <p className="text-foreground/70">We'll respond within a few hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-card border border-border/50 p-8 md:p-10 space-y-5">
              <Input label="Name" name="name" />
              <Input label="Email" name="email" type="email" />
              <Input label="Phone" name="phone" type="tel" />
              <Input label="Subject" name="subject" />
              <label className="block">
                <span className="block font-mono-display text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Message</span>
                <textarea name="message" rows={5} className="w-full bg-background/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </label>
              <button className="w-full bg-primary text-primary-foreground py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow">
                Send Message
              </button>
            </form>
          )}

          {/* Details */}
          <div className="space-y-10">
            <ContactCard icon={MapPin} title="Visit" lines={["KG 9 Avenue, Kimihurura", "Kigali, Rwanda"]} />
            <ContactCard icon={Clock} title="Hours" lines={["Monday — Sunday", "11h00 — 23h00", "Buffet: 12h — 15h"]} />
            <ContactCard icon={Phone} title="Call" lines={["+250 788 000 000"]} />
            <ContactCard icon={Mail} title="Email" lines={["hello@taniascuisine.rw", "events@taniascuisine.rw"]} />
            <a
              href="https://wa.me/250788000000"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px] aspect-[16/9] border border-border/50 overflow-hidden">
          <iframe
            title="Tania's Cuisine & Lounge location"
            src="https://www.google.com/maps?q=Kimihurura+Kigali&output=embed"
            className="w-full h-full grayscale-[40%] contrast-110"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="block font-mono-display text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{label}</span>
      <input name={name} type={type} className="w-full bg-background/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary" />
    </label>
  );
}

function ContactCard({ icon: Icon, title, lines }: { icon: typeof MapPin; title: string; lines: string[] }) {
  return (
    <div className="border-t border-primary/40 pt-6">
      <Icon className="text-primary mb-4" size={22} />
      <p className="eyebrow mb-3">{title}</p>
      {lines.map((l) => <p key={l} className="font-display text-xl">{l}</p>)}
    </div>
  );
}
