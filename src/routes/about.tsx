import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import lounge from "@/assets/lounge-interior.jpg";
import grill from "@/assets/dish-grill.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tania's Cuisine & Lounge Kigali" },
      { name: "description", content: "Since 2018, Tania's has set a standard for atmospheric dining and reliable catering in Kigali." },
      { property: "og:title", content: "About Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Kigali's atmospheric dining destination since 2018." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { t: "Commitment to Excellence", d: "Every plate, every event — held to the same standard, no exceptions." },
  { t: "Modern Hospitality", d: "Warm service done with precision. Always present, never intrusive." },
  { t: "Reliability at Scale", d: "From a table for two to a wedding for five hundred, we deliver." },
  { t: "Culinary Expertise", d: "A team of chefs blending East African flavours with global technique." },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-6">Since 2018</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-5xl text-balance leading-[0.95]">
            Kigali's quiet <span className="italic text-primary">standard.</span>
          </h1>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={lounge} alt="The lounge" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
          <div className="space-y-6 text-foreground/75 leading-relaxed">
            <p className="text-lg">
              Tania's Cuisine & Lounge opened its doors in 2018 with a simple
              belief: that Kigali deserved a place where dining was both an
              event and an everyday pleasure.
            </p>
            <p>
              What started as a single intimate room has grown into a full
              culinary practice — a destination lounge, a daily buffet that
              regulars treat like a family table, and a catering operation
              trusted by embassies, weddings and corporates alike.
            </p>
            <p>
              We source carefully. We cook seriously. We serve with warmth.
              That's the whole philosophy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-card/30">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-6">What guides us</p>
          <h2 className="font-display text-4xl md:text-5xl mb-16 max-w-2xl">Our values, plated.</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
            {values.map((v, i) => (
              <div key={v.t} className="border-t border-primary/30 pt-8">
                <p className="font-mono-display text-[10px] tracking-[0.3em] text-primary mb-4">0{i + 1}</p>
                <h3 className="font-display text-2xl mb-3">{v.t}</h3>
                <p className="text-foreground/65 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <p className="eyebrow">The Team</p>
            <h2 className="font-display text-4xl md:text-5xl text-balance">A kitchen of <span className="italic text-primary">quiet veterans.</span></h2>
            <p className="text-foreground/70 leading-relaxed">
              Our brigade brings together chefs trained in Kigali, Nairobi, Paris and
              Mumbai — anchored by a service team that's been with us since the
              beginning.
            </p>
          </div>
          <div className="order-1 lg:order-2 aspect-[4/3] overflow-hidden">
            <img src={grill} alt="The kitchen" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
