import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import lounge from "@/assets/area/area-01.jpeg";
import catering from "@/assets/area/area-02.jpeg";
import buffet from "@/assets/area/area-03.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tania's Cuisine & Lounge | Part of Tany's Ltd, Kigali" },
      { name: "description", content: "Part of Tany's Ltd (est. 2018). Tania's Cuisine & Lounge opened February 2020 at M&M Plaza, Gishushu, Kigali. Kigali's premier dining, lounge and catering destination. Up to 800 guests per event." },
      { property: "og:title", content: "About — Tania's Cuisine & Lounge | Part of Tany's Ltd" },
      { property: "og:description", content: "Kigali's premier dining destination since Feb 2020. Part of Tany's Ltd. African hospitality, global standards." },
      { property: "og:url", content: "https://taniascuisine.rw/about" },
      { name: "twitter:title", content: "About — Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "Part of Tany's Ltd. Kigali's premier dining destination since Feb 2020." },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/about" }],
  }),
  component: AboutPage,
});

const clients = [
  "Access Bank", "The New Times", "SONARWA", "GIZ",
  "Vivo Energy / Engen Rwanda", "Oxfam", "Horizon Group", "Bank of Kigali",
];

const values = [
  { t: "Commitment to Excellence", d: "Every plate, every event — held to the same standard, no exceptions." },
  { t: "Modern Hospitality", d: "Warm service done with precision. Always present, never intrusive." },
  { t: "Reliability at Scale", d: "From a table for two to a gala for a thousand, we deliver." },
  { t: "Culinary Expertise", d: "A team of chefs blending East African flavours with global technique." },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow mb-6">Tany's Ltd · Since 2018</p>
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
              Tania's Cuisine & Lounge is a property of <strong>Tany's Ltd</strong>, a
              Rwandan hospitality company established in 2018. Tania's opened its
              doors in February 2020 at M&M Plaza, Gishushu, Kigali — and despite
              launching in a pandemic year, quickly became a staple of the city's
              dining scene.
            </p>
            <p>
              What began as a single intimate venue has grown into a full
              culinary practice: a destination lounge with a daily chef's buffet,
              a catering operation trusted by Rwanda's leading institutions, and
              a venue capable of hosting up to 800 guests per event.
            </p>
            <p>
              Our vision is to set the standard for modern African hospitality —
              where meticulous service, exceptional food, and atmospheric design
              come together as one experience.
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
            <p className="eyebrow">Trusted By</p>
            <h2 className="font-display text-4xl md:text-5xl text-balance">Partners we're <span className="italic text-primary">proud to serve.</span></h2>
            <p className="text-foreground/70 leading-relaxed mb-8">
              From corporate headquarters to international organisations, our
              catering and event services are relied upon by some of Rwanda's
              most respected institutions.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {clients.map((c) => (
                <div key={c} className="border border-border/40 px-4 py-3">
                  <p className="font-mono-display text-[10px] tracking-[0.15em] uppercase text-foreground/80">{c}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 aspect-[4/3] overflow-hidden">
            <img src={catering} alt="Catered corporate event" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-card/30">
        <div className="mx-auto max-w-[1300px] grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={buffet} alt="Daily buffet spread" loading="lazy" className="w-full h-full object-cover image-mood" />
          </div>
          <div className="space-y-6">
            <p className="eyebrow">The Team</p>
            <h2 className="font-display text-4xl md:text-5xl text-balance">A kitchen of <span className="italic text-primary">quiet veterans.</span></h2>
            <p className="text-foreground/70 leading-relaxed">
              Our brigade brings together chefs trained in Kigali, Nairobi, Paris and
              Mumbai — anchored by a service team that's been with us since the
              beginning.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
