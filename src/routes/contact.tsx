import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import { MapPin, Phone, Mail, Clock, MessageCircle, Check, Instagram, Twitter, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImg from "@/assets/area/area-07.webp";
import interiorImg from "@/assets/area/area-08.webp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tania's Cuisine & Lounge | Best Restaurant in Gishushu, Kigali" },
      { name: "description", content: "Contact Kigali's best restaurant at M&M Plaza, Gishushu. Reserve a table, inquire about catering, or book the lounge. WhatsApp +250 789 289 450 | Mon–Sun 11:00–23:00." },
      { property: "og:title", content: "Contact — Best Restaurant in Gishushu, Kigali | Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Contact Kigali's best restaurant at M&M Plaza, Gishushu. Reserve a table, inquire about catering. WhatsApp +250 789 289 450." },
      { property: "og:url", content: "https://taniascuisine.rw/contact" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:title", content: "Contact — Best Restaurant in Gishushu | Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "Contact Kigali's best restaurant at M&M Plaza, Gishushu. Reserve a table. WhatsApp +250 789 289 450." },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/contact" }],
  }),
  component: ContactPage,
});

const WHATSAPP_NUMBER = "250789289450";
const PHONE_DISPLAY = "+250 789 289 450";

const SUBJECTS = ["General inquiry", "Reservation", "Catering inquiry", "Event booking", "Private dining", "Feedback", "Other"];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General inquiry",
    message: "",
  });
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const msg = [
      `*Contact — Tania's Cuisine & Lounge*`,
      ``,
      `Subject: ${form.subject}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      ``,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean).join("\n");
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setWhatsappLink(link);
    setSent(true);
  }

  return (
    <SiteLayout>
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://taniascuisine.rw" },
        { name: "Contact", item: "https://taniascuisine.rw/contact" },
      ]} />
      {/* HERO */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/5" />
        <div className="relative z-10 mx-auto max-w-[1300px] w-full px-6 md:px-12 pb-16 md:pb-20">
          <p className="eyebrow mb-4 md:mb-6">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Let's <span className="italic text-primary">connect.</span>
          </h1>
          <p className="mt-4 md:mt-6 max-w-xl text-foreground/70 text-sm md:text-base">
            Reserve a table, inquire about catering, or just say hello.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            <InfoBlock icon={MapPin} title="Visit" className="bg-card">
              <p className="font-display text-lg md:text-xl">M&M Plaza, Gishushu</p>
              <p className="font-display text-lg md:text-xl">Kigali, Rwanda</p>
              <a
                href="https://maps.google.com/?q=Tania%27s+Cuisine+%26+Lounge+Gishushu+Kigali"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-4 font-mono-display text-[10px] tracking-[0.25em] uppercase text-primary hover:text-primary/80 transition-colors"
              >
                Open Maps <ArrowRight size={12} />
              </a>
            </InfoBlock>
            <InfoBlock icon={Clock} title="Hours" className="bg-card">
              <p className="font-display text-lg md:text-xl">Mon — Fri</p>
              <p className="text-foreground/70 text-sm">10h00 — 23h00</p>
              <p className="font-display text-lg md:text-xl mt-2">Sat & Sun</p>
              <p className="text-foreground/70 text-sm">13h00 — 23h00</p>
            </InfoBlock>
            <InfoBlock icon={Phone} title="Call" className="bg-card">
              <a href={`tel:${PHONE_DISPLAY}`} className="font-display text-lg md:text-xl hover:text-primary transition-colors">
                {PHONE_DISPLAY}
              </a>
              <p className="text-foreground/60 text-xs mt-3 font-mono-display tracking-[0.1em] uppercase">
                Reservations & Inquiries
              </p>
            </InfoBlock>
            <InfoBlock icon={Mail} title="Email" className="bg-card">
              <a href="mailto:hello@taniascuisine.rw" className="font-display text-base md:text-lg hover:text-primary transition-colors block">
                hello@taniascuisine.rw
              </a>
              <a href="mailto:events@taniascuisine.rw" className="font-display text-base md:text-lg hover:text-primary transition-colors block">
                events@taniascuisine.rw
              </a>
            </InfoBlock>
          </div>
        </div>
      </section>

      {/* RESERVATION + MAP */}
      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-5 gap-12">
          {/* Reservation form */}
          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">General Inquiry</p>
            <h2 className="font-display text-3xl md:text-4xl mb-6">Get in touch — <span className="italic text-primary">reservations, events & more.</span></h2>
            {sent ? (
              <div className="bg-card border border-primary/40 p-10 md:p-12 text-center">
                <Check className="text-primary mx-auto mb-6" size={44} />
                <h3 className="font-display text-3xl mb-3">Message ready to send.</h3>
                <p className="text-foreground/70 mb-8">
                  Tap below to send your message to our team on WhatsApp. We'll respond as soon as possible.
                </p>
                <div className="space-y-3 max-w-md mx-auto text-left bg-background/50 border border-border/50 p-5 mb-8">
                  <Row label="Subject" value={form.subject} />
                  <Row label="Name" value={form.name} />
                  <Row label="Phone" value={form.phone} />
                  {form.email && <Row label="Email" value={form.email} />}
                </div>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow"
                  >
                    <MessageCircle size={16} /> Send via WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setSent(false)}
                  className="block mx-auto mt-6 font-mono-display text-[10px] tracking-[0.25em] uppercase text-foreground/50 hover:text-primary"
                >
                  Edit details
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-card border border-border/50 p-6 md:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full name" required>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                      className="input"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      required
                      placeholder="+250 …"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Email (optional)">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Subject" icon={MessageCircle}>
                  <StyledSelect
                    value={form.subject}
                    onChange={(v) => update("subject", v)}
                    options={SUBJECTS.map((s) => ({ value: s, label: s }))}
                    placeholder="Select subject"
                  />
                </Field>

                <Field label="Message" required>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    className="input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow"
                >
                  Send via WhatsApp
                </button>
                <p className="text-[11px] text-foreground/50 text-center">
                  We'll respond on WhatsApp during business hours.
                </p>
              </form>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={interiorImg} alt="Interior" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="bg-card border border-border/30 p-6 md:p-8">
              <MessageCircle className="text-primary mb-4" size={24} />
              <p className="font-display text-xl mb-2">Prefer WhatsApp?</p>
              <p className="text-foreground/65 text-sm mb-5">
                Skip the form and message us directly. We typically respond within minutes during operating hours.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono-display text-[10px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow"
              >
                <MessageCircle size={14} /> Message Us
              </a>
            </div>
            <div className="border-t border-primary/30 pt-6">
              <p className="eyebrow mb-4">Follow Us</p>
              <div className="flex gap-3">
                <a href="https://instagram.com/taniacuisineandlounge" target="_blank" rel="noreferrer" className="border border-border/50 p-3 hover:border-primary hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com/LoungeTania" target="_blank" rel="noreferrer" className="border border-border/50 p-3 hover:border-primary hover:text-primary transition-colors">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-4">Find Us</p>
          <h2 className="font-display text-3xl md:text-4xl mb-8">M&M Plaza, <span className="italic text-primary">Gishushu.</span></h2>
          <div className="aspect-[21/9] border border-border/40 overflow-hidden">
            <iframe
              title="Tania's Cuisine & Lounge — M&M Plaza, Gishushu, Kigali"
              src="https://www.google.com/maps?q=Tania%27s+Cuisine+%26+Lounge+Gishushu+Kigali&output=embed"
              className="w-full h-full grayscale-[30%] contrast-110"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoBlock({ icon: Icon, title, children, className }: { icon: typeof MapPin; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 md:p-8 ${className ?? ""}`}>
      <Icon className="text-primary mb-4" size={22} />
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}

function StyledSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-background/60 border-border/60 rounded-none h-auto px-4 py-3 text-sm focus:ring-primary focus:border-primary text-foreground">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-card border-border/60 rounded-none">
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="font-sans text-sm focus:bg-primary/10 focus:text-primary"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({
  label,
  children,
  icon: Icon,
  required,
}: {
  label: string;
  children: React.ReactNode;
  icon?: typeof Calendar;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 font-mono-display text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
        {Icon && <Icon size={11} />} {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 text-sm">
      <span className="font-mono-display text-[9px] tracking-[0.25em] uppercase text-foreground/45">{label}</span>
      <span className="text-foreground/90 text-right">{value}</span>
    </div>
  );
}
