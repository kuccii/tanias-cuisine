import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { categories, dishes, type Category, type Dish } from "@/data/menu";
import { X } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Tania's Cuisine & Lounge" },
      { name: "description", content: "Browse Tania's full menu of grills, curries, wraps, platters and signature drinks. Kigali, since 2018." },
      { property: "og:title", content: "The Menu — Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Grills, curries, wraps, platters, daily buffet and signature drinks." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<Dish | null>(null);

  const filtered = active === "All" ? dishes : dishes.filter((d) => d.category === active);

  return (
    <SiteLayout>
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow mb-6">The Living Menu</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            Browse by <span className="italic text-primary">craving.</span>
          </h1>
          <p className="mt-8 max-w-xl text-foreground/70">
            Each dish is plated to order and shaped by what's fresh that morning.
            Prices in Rwandan francs.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[68px] z-30 glass border-y border-border/40">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12 py-4 flex gap-2 md:gap-3 overflow-x-auto">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 font-mono-display text-[10px] tracking-[0.25em] uppercase px-4 py-2.5 border transition-colors ${
                active === c
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border/50 text-foreground/60 hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((d) => (
              <article
                key={d.id}
                onClick={() => setSelected(d)}
                className="group cursor-pointer bg-card border border-border/40 overflow-hidden hover:border-primary/60 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover image-mood transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                  {d.serves && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-mono-display text-[9px] tracking-[0.2em] uppercase px-3 py-1.5">
                      Serves {d.serves}
                    </span>
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-display text-2xl">{d.name}</h3>
                    <span className="font-mono-display text-[11px] tracking-[0.18em] text-primary whitespace-nowrap">{d.price}</span>
                  </div>
                  <p className="text-sm text-foreground/65 leading-relaxed">{d.description}</p>
                  <p className="mt-5 font-mono-display text-[10px] tracking-[0.25em] uppercase text-foreground/40 group-hover:text-primary transition-colors">
                    View details →
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-background/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-card border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-background/70 hover:bg-background border border-border"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
              <img src={selected.image} alt={selected.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-12">
              <p className="eyebrow mb-4">{selected.category}</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">{selected.name}</h2>
              <p className="font-mono-display text-base text-primary mb-8">{selected.price}</p>
              <p className="text-foreground/75 leading-relaxed mb-8">{selected.description}</p>

              {selected.pairing && (
                <div className="border-t border-border/40 pt-6 mb-6">
                  <p className="eyebrow mb-3">Pairing Suggestion</p>
                  <p className="font-display italic text-lg text-foreground/85">{selected.pairing}</p>
                </div>
              )}

              {selected.serves && (
                <div className="border-t border-border/40 pt-6 mb-8">
                  <p className="eyebrow mb-3">Serves</p>
                  <p className="font-display text-lg">{selected.serves}</p>
                </div>
              )}

              <a
                href="/catering"
                className="inline-block bg-primary text-primary-foreground px-7 py-4 font-mono-display text-[11px] tracking-[0.28em] uppercase hover:shadow-glow transition-shadow"
              >
                {selected.category === "Platters" ? "Inquire about catering" : "Reserve a Table"}
              </a>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
