import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { MapPin, Phone, Mail, Clock, MessageCircle, Check, Users, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Reservations & Contact — Tania's Cuisine & Lounge" },
      { name: "description", content: "Reserve a table at Tania's Cuisine & Lounge, Remera Kigali. Choose date, time and party size — WhatsApp confirmation within minutes." },
      { property: "og:title", content: "Reserve a Table — Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Book your table in seconds. Confirmation by WhatsApp." },
    ],
  }),
  component: ContactPage,
});

// Real venue (KG 8 Ave, M&M Plaza, Remera, Kigali)
const WHATSAPP_NUMBER = "250789289450";
const PHONE_DISPLAY = "+250 789 289 450";

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

const OCCASIONS = ["No occasion", "Birthday", "Anniversary", "Business", "Date night", "Family gathering"];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: todayISO(),
    time: "19:00",
    party: "2",
    occasion: "No occasion",
    notes: "",
  });
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const msg = [
      `*New Reservation Request — Tania's*`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      `Date: ${form.date}`,
      `Time: ${form.time}`,
      `Party size: ${form.party}`,
      `Occasion: ${form.occasion}`,
      form.notes && `Notes: ${form.notes}`,
    ].filter(Boolean).join("\n");
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setWhatsappLink(link);
    setSent(true);
  }

  const partySizes = [...Array.from({ length: 14 }, (_, i) => String(i + 1)), "15+"];

  return (
    <SiteLayout>
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-6">Reserve · Reach Us</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Book your <span className="italic text-primary">table.</span>
          </h1>
          <p className="mt-8 max-w-xl text-foreground/70">
            Choose your date, time and party size. We'll confirm by WhatsApp within minutes.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-5 gap-12">
          {/* Reservation form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="bg-card border border-primary/40 p-10 md:p-12 text-center">
                <Check className="text-primary mx-auto mb-6" size={44} />
                <h3 className="font-display text-3xl mb-3">Reservation request ready.</h3>
                <p className="text-foreground/70 mb-8">
                  Tap below to send your details to our team on WhatsApp. We'll confirm availability immediately.
                </p>
                <div className="space-y-3 max-w-md mx-auto text-left bg-background/50 border border-border/50 p-5 mb-8">
                  <Row label="Name" value={form.name} />
                  <Row label="When" value={`${form.date} · ${form.time}`} />
                  <Row label="Party" value={`${form.party} guests`} />
                  <Row label="Occasion" value={form.occasion} />
                </div>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow"
                  >
                    <MessageCircle size={16} /> Confirm via WhatsApp
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

                <div className="grid sm:grid-cols-3 gap-5">
                  <Field label="Date" icon={Calendar} required>
                    <input
                      type="date"
                      min={todayISO()}
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                      required
                      className="input"
                    />
                  </Field>
                  <Field label="Time" icon={Clock} required>
                    <StyledSelect
                      value={form.time}
                      onChange={(v) => update("time", v)}
                      options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
                      placeholder="Select time"
                    />
                  </Field>
                  <Field label="Party" icon={Users} required>
                    <StyledSelect
                      value={form.party}
                      onChange={(v) => update("party", v)}
                      options={partySizes.map((n) => ({
                        value: n,
                        label: n === "15+" ? "15+ guests" : `${n} ${n === "1" ? "guest" : "guests"}`,
                      }))}
                      placeholder="Party size"
                    />
                  </Field>
                </div>

                <Field label="Occasion">
                  <StyledSelect
                    value={form.occasion}
                    onChange={(v) => update("occasion", v)}
                    options={OCCASIONS.map((o) => ({ value: o, label: o }))}
                    placeholder="Select occasion"
                  />
                </Field>

                <Field label="Special requests (optional)">
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Dietary needs, seating preference…"
                    className="input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow"
                >
                  Continue to Confirmation
                </button>
                <p className="text-[11px] text-foreground/50 text-center">
                  Final confirmation happens via WhatsApp with our host.
                </p>
              </form>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            <ContactCard icon={MapPin} title="Visit" lines={["KG 8 Avenue · M&M Plaza", "Remera, Kigali · Rwanda"]} />
            <ContactCard icon={Clock} title="Hours" lines={["Mon — Fri · 10h00 — 23h00", "Sat & Sun · 13h00 — 23h00"]} />
            <ContactCard icon={Phone} title="Call" lines={[PHONE_DISPLAY]} />
            <ContactCard icon={Mail} title="Email" lines={["hello@taniascuisine.rw", "events@taniascuisine.rw"]} />
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="inline-flex items-center gap-3 border border-border/60 px-6 py-3 font-mono-display text-[10px] tracking-[0.28em] uppercase hover:border-primary hover:text-primary transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1300px] aspect-[16/9] border border-border/50 overflow-hidden">
          <iframe
            title="Tania's Cuisine & Lounge — KG 8 Ave, Remera, Kigali"
            src="https://www.google.com/maps?q=Tania%27s+Cuisine+%26+Lounge+KG+8+Ave+Remera+Kigali&output=embed"
            className="w-full h-full grayscale-[40%] contrast-110"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
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

function ContactCard({ icon: Icon, title, lines }: { icon: typeof MapPin; title: string; lines: string[] }) {
  return (
    <div className="border-t border-primary/40 pt-6">
      <Icon className="text-primary mb-4" size={22} />
      <p className="eyebrow mb-3">{title}</p>
      {lines.map((l) => <p key={l} className="font-display text-xl">{l}</p>)}
    </div>
  );
}
