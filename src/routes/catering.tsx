import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import catering from "@/assets/area/area-14.webp";
import gallery1 from "@/assets/area/area-02.webp";
import gallery2 from "@/assets/area/area-09.webp";
import gallery3 from "@/assets/area/area-15.webp";
import { Check } from "lucide-react";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering & Events — Tania's Cuisine & Lounge | Best Catering in Kigali" },
      { name: "description", content: "Best catering in Kigali from Kigali's best restaurant. Corporate catering, weddings, galas, private events for 50–800 guests. Trusted by Access Bank, Bank of Kigali, GIZ. Part of Tany's Ltd." },
      { property: "og:title", content: "Catering & Events — Best Catering in Kigali | Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Best catering in Kigali for 50–800 guests. Corporate, weddings, private events. Trusted by Access Bank, Bank of Kigali." },
      { property: "og:url", content: "https://taniascuisine.rw/catering" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:title", content: "Best Catering in Kigali | Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "Best catering in Kigali for 50–800 guests. Corporate, weddings, private events. Trusted by top brands." },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/catering" }],
  }),
  component: CateringPage,
});

const packages = [
  {
    title: "Corporate Catering",
    desc: "Working lunches, conferences, retreats. Predictable, clean service for 30 – 300 guests.",
    items: ["Boxed and buffet formats", "Dietary segmentation", "On-site service team"],
  },
  {
    title: "Weddings & Galas",
    desc: "Full-day catering for celebrations of a lifetime. 100 – 800 guests.",
    items: ["Tasting session included", "Custom menu design", "Bar & beverage program"],
  },
  {
    title: "Private Events",
    desc: "Birthdays, anniversaries, intimate gatherings. Chef's table available.",
    items: ["Chef-attended service", "Custom decor partners", "From 20 guests"],
  },
  {
    title: "Daily Buffet Delivery",
    desc: "Recurring office buffets, delivered hot. Weekly contracts available.",
    items: ["Three proteins, six sides", "From 25 guests / day", "Sustainable packaging"],
  },
];

function CateringPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <SiteLayout>
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://taniascuisine.rw" },
        { name: "Catering", item: "https://taniascuisine.rw/catering" },
      ]} />
      <section className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <img src={catering} alt="Catered event" className="absolute inset-0 w-full h-full object-cover image-mood-deep" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-overlay)" }} />
        <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 md:px-12 pb-20">
          <p className="eyebrow mb-6">Catering & Events</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Service that <span className="italic text-primary">scales.</span>
          </h1>
          <p className="mt-6 font-mono-display text-[11px] tracking-[0.25em] uppercase text-foreground/60">
            Serving 50 — 800 guests across Rwanda · Part of Tany's Ltd
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow mb-5">Our Offerings</p>
            <h2 className="font-display text-4xl md:text-5xl text-balance">
              Four ways we <span className="italic text-primary">feed your moments.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {packages.map((p, i) => (
              <div key={p.title} className="bg-card border border-border/40 p-10 hover:border-primary/50 transition-colors">
                <p className="font-mono-display text-[10px] tracking-[0.3em] text-primary mb-4">0{i + 1}</p>
                <h3 className="font-display text-3xl mb-4">{p.title}</h3>
                <p className="text-foreground/65 mb-8 leading-relaxed">{p.desc}</p>
                <ul className="space-y-3">
                  {p.items.map((x) => (
                    <li key={x} className="flex gap-3 text-sm text-foreground/80">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="grid md:grid-cols-3 gap-2">
        {[gallery1, gallery2, gallery3].map((src, i) => (
          <div key={i} className="aspect-[4/3] overflow-hidden">
            <img src={src} alt="Past event" loading="lazy" className="w-full h-full object-cover image-mood hover:scale-105 transition-transform duration-[1500ms]" />
          </div>
        ))}
      </section>

      {/* Inquiry form */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-[1100px] grid lg:grid-cols-2 gap-16">
          <div>
            <p className="eyebrow mb-6">Plan With Us</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 text-balance">
              Tell us about your <span className="italic text-primary">event.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-8">
              Share the basics and our events team will respond within 24 hours
              with a tailored proposal — including menus, staffing, and pricing.
            </p>
            <blockquote className="font-display italic text-xl text-foreground/85 border-l-2 border-primary pl-6">
              "Tania catered our 280-guest wedding flawlessly. Guests are still
              talking about the food."
              <footer className="not-italic font-mono-display text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-4">
                — Aline & Eric, Married 2024
              </footer>
            </blockquote>
          </div>

          {sent ? (
            <div className="bg-card border border-primary/50 p-10 flex flex-col justify-center text-center">
              <Check className="text-primary mx-auto mb-6" size={36} />
              <h3 className="font-display text-3xl mb-3">Inquiry received.</h3>
              <p className="text-foreground/70">Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-card border border-border/50 p-8 md:p-10 grid grid-cols-2 gap-4">
              <Field label="Name" name="name" full />
              <Field label="Email" name="email" type="email" />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Event Type" name="type" as="select" options={["Corporate", "Wedding", "Private Event", "Buffet Delivery"]} />
              <Field label="Guest Count" name="guests" type="number" />
              <Field label="Event Date" name="date" type="date" full />
              <Field label="Dietary requirements or notes" name="notes" as="textarea" full />
              <button
                type="submit"
                className="col-span-2 mt-4 bg-primary text-primary-foreground py-4 font-mono-display text-[11px] tracking-[0.3em] uppercase hover:shadow-glow transition-shadow"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  as,
  options,
  full,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "textarea" | "select";
  options?: string[];
  full?: boolean;
}) {
  const cls = "w-full bg-background/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors";
  return (
    <label className={full ? "col-span-2" : "col-span-2 md:col-span-1"}>
      <span className="block font-mono-display text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} rows={3} className={cls} />
      ) : as === "select" ? (
        <select name={name} className={cls}>
          {options?.map((o) => <option key={o} value={o} className="bg-background">{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} className={cls} />
      )}
    </label>
  );
}
