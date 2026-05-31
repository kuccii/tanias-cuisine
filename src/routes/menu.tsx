import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { menuSections, restaurantInfo, type MenuItem, type MenuSection } from "@/data/menu";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Tania's Cuisine & Lounge" },
      { name: "description", content: "Snacks, grills, goat & chicken specialties, fresh fish, coffee bar, juices and more. Tania's full menu in Kigali." },
      { property: "og:title", content: "The Menu — Tania's Cuisine & Lounge" },
      { property: "og:description", content: "A culinary journey of African flavors — grills, curries, coffee and more." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () => (active === "all" ? menuSections : menuSections.filter((s) => s.id === active)),
    [active],
  );

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow mb-6">The Living Menu · Est. {restaurantInfo.est}</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
            A culinary journey of <span className="italic text-primary">African flavors.</span>
          </h1>
          <p className="mt-8 max-w-xl text-foreground/70">
            {restaurantInfo.currency_note}. Most dishes plated to order — preparation times noted where applicable.
          </p>
        </div>
      </section>

      {/* SECTION FILTER */}
      <section className="sticky top-[68px] z-30 glass border-y border-border/40">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12 py-4 flex gap-2 md:gap-3 overflow-x-auto">
          <FilterChip active={active === "all"} onClick={() => setActive("all")} label="All" />
          {menuSections.map((s) => (
            <FilterChip
              key={s.id}
              active={active === s.id}
              onClick={() => {
                setActive(s.id);
                requestAnimationFrame(() => {
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              label={s.title}
            />
          ))}
        </div>
      </section>

      {/* SECTIONS */}
      <div className="pb-24">
        {visible.map((section, idx) => (
          <Section key={section.id} section={section} index={idx} />
        ))}
      </div>
    </SiteLayout>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 font-mono-display text-[10px] tracking-[0.25em] uppercase px-4 py-2.5 border transition-colors ${
        active
          ? "border-primary text-primary bg-primary/5"
          : "border-border/50 text-foreground/60 hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ section, index }: { section: MenuSection; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <section id={section.id} className="scroll-mt-32 py-16 md:py-24 px-6 md:px-12 border-t border-border/30">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className={`grid lg:grid-cols-12 gap-10 mb-14 items-end ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div className="lg:col-span-5 lg:[direction:ltr]">
            <div className="relative aspect-[4/3] overflow-hidden bg-card">
              <img
                src={section.image}
                alt={section.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover image-mood"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent" />
              <p className="absolute bottom-5 left-5 font-mono-display text-[10px] tracking-[0.3em] uppercase text-primary">
                {section.category}
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:[direction:ltr]">
            <p className="eyebrow mb-4">Chapter 0{index + 1}</p>
            <h2 className="font-display text-4xl md:text-6xl text-balance mb-4">
              {section.title}
            </h2>
            <p className="text-foreground/65 max-w-xl">{section.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        {section.groups ? (
          <div className={`grid gap-12 ${section.groups.length > 2 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {section.groups.map((g) => (
              <div key={g.name}>
                <h3 className="font-display text-2xl md:text-3xl mb-6 pb-3 border-b border-primary/30">
                  <span className="italic text-primary">— </span>
                  {g.name}
                </h3>
                <ItemList items={g.items} compact={section.compact} />
              </div>
            ))}
          </div>
        ) : (
          <div className={section.compact ? "grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1" : "grid md:grid-cols-2 gap-x-16 gap-y-2"}>
            <ItemList items={section.items ?? []} compact={section.compact} flat />
          </div>
        )}

        {/* Special box */}
        {section.special_box && (
          <div className="mt-14 relative border border-primary/40 bg-primary/5 p-8 md:p-10">
            <span className="absolute -top-3 left-8 bg-background px-3 font-mono-display text-[10px] tracking-[0.3em] uppercase text-primary">
              ★ {section.special_box.title}
            </span>
            <div className="grid md:grid-cols-2 gap-x-16">
              <ItemList items={section.special_box.items} flat />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ItemList({ items, compact, flat }: { items: MenuItem[]; compact?: boolean; flat?: boolean }) {
  if (flat) {
    return (
      <>
        {items.map((it) => (
          <ItemRow key={it.name} item={it} compact={compact} />
        ))}
      </>
    );
  }
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <ItemRow key={it.name} item={it} compact={compact} />
      ))}
    </ul>
  );
}

function ItemRow({ item, compact }: { item: MenuItem; compact?: boolean }) {
  return (
    <li className={`group flex items-baseline gap-3 ${compact ? "py-2" : "py-3"} border-b border-border/20`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <h4 className={`font-display ${compact ? "text-lg" : "text-xl"} text-foreground/95`}>
            {item.name}
          </h4>
          <span className="flex-1 border-b border-dotted border-border/40 translate-y-[-4px]" />
          <span className="font-mono-display text-[11px] tracking-[0.18em] text-primary whitespace-nowrap">
            {item.price}
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-foreground/55 italic mt-1">{item.description}</p>
        )}
        {item.note && (
          <p className="mt-1 inline-flex items-center gap-1.5 font-mono-display text-[9px] tracking-[0.22em] uppercase text-foreground/45">
            <Clock size={10} /> {item.note}
          </p>
        )}
      </div>
    </li>
  );
}
