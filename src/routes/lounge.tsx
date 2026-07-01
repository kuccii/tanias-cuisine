import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import lounge from "@/assets/area/area-17.jpeg";
import buffet from "@/assets/area/area-04.jpeg";
import loungeDrink from "@/assets/area/area-10.jpeg";
import loungeFood from "@/assets/area/area-12.jpeg";
import { MapPin, Clock, Phone } from "lucide-react";

export const Route = createFileRoute("/lounge")({
  head: () => ({
    meta: [
      { title: "The Lounge — Tania's Cuisine & Lounge | Best Restaurant & Lounge in Gishushu, Kigali" },
      { name: "description", content: "Kigali's best restaurant lounge at M&M Plaza, Gishushu. Velvet booths, copper pendants, daily chef's buffet (12,000 RWF). Open Mon–Sun. Reserve your table at Tania's — the top restaurant in Kigali." },
      { property: "og:title", content: "The Lounge — Best Restaurant & Lounge in Gishushu, Kigali | Tania's" },
      { property: "og:description", content: "Kigali's best restaurant lounge at M&M Plaza, Gishushu. Daily chef's buffet, velvet booths. Reserve your table." },
      { property: "og:url", content: "https://taniascuisine.rw/lounge" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:title", content: "The Lounge — Best Restaurant in Gishushu | Tania's" },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/lounge" }],
  }),
  component: LoungePage,
});

function LoungePage() {
  return (
    <SiteLayout>
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://taniascuisine.rw" },
        { name: "Lounge", item: "https://taniascuisine.rw/lounge" },
      ]} />
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
        <img src={lounge} alt="Tania's Lounge interior" className="absolute inset-0 w-full h-full object-cover image-mood-deep" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-overlay)" }} />
        <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 md:px-12 pb-20">
          <p className="eyebrow mb-6">The Lounge</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Long evenings, <span className="italic text-primary">low light.</span>
          </h1>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 aspect-[16/10] overflow-hidden">
            <img src={lounge} alt="Lounge seating" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
          <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
            <img src={loungeDrink} alt="Lounge cocktail" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
          <div className="aspect-[16/10] overflow-hidden">
            <img src={loungeFood} alt="Grilled fish" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
          <div className="md:col-span-2 aspect-[16/10] overflow-hidden">
            <img src={buffet} alt="Daily buffet" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
        </div>
      </section>

      {/* Daily buffet */}
      <section className="py-24 px-6 md:px-12 bg-card/40">
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-6">Daily Lounge Buffet</p>
            <h2 className="font-display text-4xl md:text-6xl mb-6 text-balance">
              Lunch, <span className="italic text-primary">unhurried.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-10">
              A rotating chef's selection of three proteins, six sides, salads and a
              dessert of the day — refreshed each morning, served noon to three.
            </p>
            <ul className="space-y-3 mb-10 text-foreground/85">
              <li className="flex gap-4"><span className="text-primary font-mono-display text-sm">01</span> Three rotating proteins, including the grill of the day</li>
              <li className="flex gap-4"><span className="text-primary font-mono-display text-sm">02</span> Six chef's sides and seasonal salads</li>
              <li className="flex gap-4"><span className="text-primary font-mono-display text-sm">03</span> House-baked breads and dessert table</li>
            </ul>
            <p className="font-mono-display text-[11px] tracking-[0.25em] uppercase text-primary mb-8">12,000 RWF · 12h — 15h daily</p>
            <Link to="/contact" className="inline-block bg-primary text-primary-foreground px-8 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow">
              Reserve a Table
            </Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden order-first lg:order-last">
            <img src={buffet} alt="Daily buffet spread" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
        </div>
      </section>

      {/* Visit info */}
      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-3 gap-10">
          {[
            { icon: MapPin, title: "Location", lines: ["M&M Plaza, Gishushu", "Kigali, Rwanda"] },
            { icon: Clock, title: "Hours", lines: ["Mon — Sun", "11h00 — 23h00"] },
            { icon: Phone, title: "Reserve", lines: ["+250 789 289 450", "WhatsApp welcome"] },
          ].map((c) => (
            <div key={c.title} className="border-t border-primary/40 pt-8">
              <c.icon className="text-primary mb-6" size={24} />
              <p className="eyebrow mb-3">{c.title}</p>
              {c.lines.map((l) => <p key={l} className="font-display text-xl">{l}</p>)}
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
