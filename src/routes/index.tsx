import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { menuSections } from "@/data/menu";
import beefTwatundi from "@/assets/menu/beef-twatundi.jpg";
import wholeTilapia from "@/assets/menu/whole-tilapia.jpg";
import sombeImg from "@/assets/menu/sombe.jpg";
import heroVideo from "@/assets/herovideo.mp4";
import loungeImg from "@/assets/area/area-01.jpeg";
import cateringImg from "@/assets/area/area-14.jpeg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tania's Cuisine & Lounge — Best Restaurant in Kigali | African Dining & Lounge" },
      { name: "description", content: "Best restaurant in Kigali at M&M Plaza, Gishushu. African grills, Swahili fish, daily chef's buffet (12,000 RWF), coffee bar. Reserve a table at Kigali's finest dining destination. Open daily." },
      { property: "og:title", content: "Tania's Cuisine & Lounge — Best Restaurant in Kigali | African Dining & Lounge" },
      { property: "og:description", content: "Best restaurant in Kigali at M&M Plaza, Gishushu. African grills, daily chef's buffet, coffee bar. Reserve your table." },
      { property: "og:url", content: "https://taniascuisine.rw" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tania's Cuisine & Lounge — Best Restaurant in Kigali" },
      { name: "twitter:description", content: "Best restaurant in Kigali. African grills, daily buffet, coffee bar at M&M Plaza, Gishushu." },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw" }],
  }),
  component: Index,
});

function Index() {
  void menuSections;
  const featured = [
    { id: "beef-twatundi", name: "Twatundi Beef", category: "From the Grill", description: "Slow-grilled Rwandan-style beef — bold, smoky, and deeply flavourful.", image: beefTwatundi },
    { id: "whole-tilapia", name: "Whole Tilapia Fish", category: "Fresh Catch", description: "Whole tilapia, grilled to perfection — crisp skin, tender flesh, lake to plate.", image: wholeTilapia },
    { id: "sombe", name: "Sombe", category: "Sides & Greens", description: "Cassava leaves simmered in rich coconut cream — a Rwandan classic.", image: sombeImg },
  ];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-end overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-overlay)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-background/40" />

        <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 md:px-12 pb-24 md:pb-32">
          <p className="eyebrow mb-8 reveal-up">Kigali · Since 2018</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-9xl leading-[0.95] text-balance max-w-5xl reveal-up" style={{ animationDelay: "0.1s" }}>
            Where every plate <br />
            <span className="italic text-primary">tells a story.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 font-light leading-relaxed reveal-up" style={{ animationDelay: "0.25s" }}>
            Tania's Cuisine & Lounge is Kigali's atmospheric home for moody fine
            dining, catering at scale, and unforgettable evenings.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 reveal-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow"
            >
              Reserve a Table
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 border border-foreground/20 px-8 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Explore the Menu <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono-display text-[9px] tracking-[0.4em] uppercase text-foreground/40">
          Scroll to indulge
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border/40 py-10 overflow-hidden">
        <div className="marquee font-display text-4xl md:text-6xl text-foreground/[0.06] uppercase tracking-[0.1em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span>Grills</span>
              <span className="text-primary">·</span>
              <span>Catering</span>
              <span className="text-primary">·</span>
              <span>Curries</span>
              <span className="text-primary">·</span>
              <span>Lounge</span>
              <span className="text-primary">·</span>
              <span>Events</span>
              <span className="text-primary">·</span>
              <span>Daily Buffet</span>
              <span className="text-primary">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <p className="eyebrow mb-5">The Signatures</p>
              <h2 className="font-display text-4xl md:text-6xl max-w-2xl text-balance">
                Three dishes that <span className="italic text-primary">define us.</span>
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 font-mono-display text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-primary"
            >
              View Full Menu <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((d, i) => (
              <Link
                to="/menu"
                key={d.id}
                className="group relative overflow-hidden bg-card aspect-[3/4]"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover image-mood transition-transform duration-[1500ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="eyebrow mb-3">0{i + 1} · {d.category}</p>
                  <h3 className="font-display text-2xl md:text-3xl mb-2">{d.name}</h3>
                  <p className="text-sm text-foreground/70 line-clamp-2">{d.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOUNGE FEATURE */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img
          src={loungeImg}
          alt="The Tania's Lounge interior"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover image-mood-deep"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />

        <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 md:px-12 py-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-6">The Lounge</p>
            <h2 className="font-display text-4xl md:text-6xl mb-6 text-balance">
              Dine in the <span className="italic text-primary">warm half-light.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-10">
              Velvet booths, copper pendants, slow service done right. Our lounge
              is built for long conversations and longer evenings — anchored by a
              daily chef's buffet from noon.
            </p>
            <Link
              to="/lounge"
              className="inline-flex items-center gap-3 border border-foreground/30 px-7 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Visit the Lounge <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CATERING FEATURE */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={cateringImg} alt="A Tania's catered event" loading="lazy" className="absolute inset-0 w-full h-full object-cover image-mood" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div>
            <p className="eyebrow mb-6">Catering & Events</p>
            <h2 className="font-display text-4xl md:text-6xl mb-6 text-balance">
              Service that <span className="italic text-primary">scales.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-10">
              From 50-guest corporate lunches to 800-person galas, our team
              delivers chef-led catering with hotel-grade execution. Tailored
              menus, dietary care, and seamless logistics.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {[
                { n: "800", l: "Guest capacity" },
                { n: "2020", l: "Launched Feb 2020" },
                { n: "200+", l: "Events catered yearly" },
                { n: "8+", l: "Key institutional clients" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl md:text-4xl text-primary">{s.n}</div>
                  <div className="font-mono-display text-[10px] tracking-[0.22em] uppercase text-muted-foreground mt-2">{s.l}</div>
                </div>
              ))}
            </div>
            <Link
              to="/catering"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow"
            >
              Plan Your Event <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
