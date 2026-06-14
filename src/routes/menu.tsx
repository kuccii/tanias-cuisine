import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { CartProvider, useCart } from "@/components/site/CartContext";
import { CartPanel } from "@/components/site/CartPanel";
import { menuSections, restaurantInfo, type MenuItem, type MenuSection } from "@/data/menu";
import { resolveItemImage } from "@/data/menu-images";
import { Clock, Star, ShoppingBag, Plus } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Tania's Cuisine & Lounge | African Flavours in Kigali" },
      { name: "description", content: "Browse the full menu at Tania's Cuisine & Lounge, Kigali. African grills, Swahili fish, peri-peri chicken, beef fillet steak, daily buffet (12,000 RWF), coffee bar, fresh juices and more. Prices in FRW." },
      { property: "og:title", content: "Menu — Tania's Cuisine & Lounge | African Flavours in Kigali" },
      { property: "og:description", content: "Browse the full menu: African grills, Swahili fish, peri-peri chicken, daily buffet, coffee bar and more. All prices in FRW." },
      { property: "og:url", content: "https://taniascuisine.rw/menu" },
      { name: "twitter:title", content: "Menu — Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "African grills, Swahili fish, daily buffet, coffee bar and more in Kigali." },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/menu" }],
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
    <CartProvider>
      <SiteLayout>
        <section className="pt-24 pb-4 px-6 md:pt-40 md:pb-16 md:px-12">
          <div className="mx-auto max-w-[1500px]">
            <p className="eyebrow mb-4 md:mb-6">The Living Menu · Est. {restaurantInfo.est}</p>
            <h1 className="font-display text-3xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
              A culinary journey of <span className="italic text-primary">African flavors.</span>
            </h1>
            <p className="mt-4 md:mt-8 max-w-xl text-foreground/70 text-sm md:text-base">
              {restaurantInfo.currency_note}. Most dishes plated to order — preparation times noted where applicable.
            </p>
          </div>
        </section>

        <section className="sticky top-[68px] lg:top-[88px] z-30 glass border-y border-border/40">
          <div className="mx-auto max-w-[1500px] px-4 md:px-12 py-3 flex gap-2 overflow-x-auto no-scrollbar">
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

        <div className="pb-32 lg:pb-24">
          {visible.map((section, idx) => (
            <Section key={section.id} section={section} index={idx} />
          ))}
        </div>
      </SiteLayout>
      <CartFab />
    </CartProvider>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 font-mono-display text-[10px] tracking-[0.2em] uppercase px-3.5 py-2 rounded-full border transition-all whitespace-nowrap ${
        active
          ? "border-primary text-primary bg-primary/10"
          : "border-border/40 text-foreground/55 hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ section, index }: { section: MenuSection; index: number }) {
  return (
    <section id={section.id} className="scroll-mt-32 lg:scroll-mt-44 py-12 md:py-28 px-4 md:px-12 border-t border-border/30">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 md:mb-14 max-w-3xl">
          <p className="eyebrow mb-2 md:mb-4">Chapter {String(index + 1).padStart(2, "0")} · {section.category}</p>
          <h2 className="font-display text-2xl md:text-6xl text-balance mb-2 md:mb-4">
            {section.title}
          </h2>
          <p className="text-foreground/65 text-sm md:text-base">{section.subtitle}</p>
        </div>

        {section.groups ? (
          <div className="space-y-10 md:space-y-16">
            {section.groups.map((g) => (
              <div key={g.name}>
                <h3 className="font-display text-lg md:text-3xl mb-4 md:mb-8 pb-2 md:pb-3 border-b border-primary/30 sticky top-[120px] lg:top-[148px] bg-background/90 backdrop-blur-sm z-20 py-2 md:py-0 md:bg-transparent md:backdrop-blur-none md:sticky md:top-[148px]">
                  <span className="italic text-primary">— </span>{g.name}
                </h3>
                <ItemGrid items={g.items} sectionId={section.id} groupName={g.name} compact={section.compact} />
              </div>
            ))}
          </div>
        ) : (
          <ItemGrid items={section.items ?? []} sectionId={section.id} compact={section.compact} />
        )}

        {section.special_box && (
          <div className="mt-10 md:mt-16 relative border border-primary/40 bg-primary/[0.04] p-6 md:p-10">
            <span className="absolute -top-3 left-6 md:left-8 bg-background px-3 font-mono-display text-[10px] tracking-[0.3em] uppercase text-primary inline-flex items-center gap-2">
              <Star size={11} className="fill-primary" /> {section.special_box.title}
            </span>
            <div className="mt-4 md:mt-0">
              <ItemGrid items={section.special_box.items} sectionId={section.id} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ItemGrid({
  items,
  sectionId,
  groupName,
  compact,
}: {
  items: MenuItem[];
  sectionId: string;
  groupName?: string;
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-3 md:gap-8 ${compact ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {items.map((it) => (
        <ItemCard key={it.name} item={it} sectionId={sectionId} groupName={groupName} compact={compact} />
      ))}
    </div>
  );
}

function ItemCard({
  item,
  sectionId,
  groupName,
  compact,
}: {
  item: MenuItem;
  sectionId: string;
  groupName?: string;
  compact?: boolean;
}) {
  const image = resolveItemImage(item.name, sectionId, groupName);
  const { addItem } = useCart();

  return (
    <article className="group sm:bg-card/40 sm:border sm:border-border/40 sm:hover:border-primary/50 sm:transition-colors flex sm:flex-col overflow-hidden gap-3 sm:gap-0">
      <div className="w-20 h-20 sm:w-full sm:aspect-[4/3] relative shrink-0 overflow-hidden rounded-lg sm:rounded-none">
        <img
          src={image}
          alt={item.name}
          loading="lazy"
          width={160}
          height={160}
          className="absolute inset-0 w-full h-full object-cover image-mood sm:transition-transform sm:duration-[1500ms] sm:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none sm:hidden" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center pr-14 sm:pr-0 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-base sm:text-xl leading-tight truncate">{item.name}</h4>
          <span className="shrink-0 font-mono-display text-[11px] sm:text-[10px] tracking-[0.15em] text-primary sm:absolute sm:top-3 sm:right-3 sm:bg-background/80 sm:backdrop-blur-sm sm:px-2.5 sm:py-1.5 sm:border sm:border-border/40">
            {item.price}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-foreground/60 italic leading-relaxed mt-0.5 line-clamp-2 sm:line-clamp-none sm:mt-2 sm:mb-3 sm:text-xs">{item.description}</p>
        )}
        {item.note && (
          <p className="hidden sm:inline-flex pt-2 items-center gap-1.5 font-mono-display text-[9px] tracking-[0.22em] uppercase text-foreground/45">
            <Clock size={10} /> {item.note}
          </p>
        )}
      </div>
      <button
        onClick={() => addItem(item.name, item.price)}
        className="absolute right-4 top-1/2 -translate-y-1/2 sm:relative sm:translate-y-0 sm:right-auto sm:top-auto w-10 h-10 rounded-full bg-primary/10 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center sm:mt-auto sm:mx-5 sm:mb-5 sm:w-auto sm:h-auto sm:rounded-none sm:bg-transparent sm:border-none sm:text-[11px] sm:font-semibold sm:hover:bg-transparent sm:hover:text-primary/80 sm:pt-3 sm:inline-flex sm:gap-1.5 sm:cursor-pointer"
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus size={18} className="sm:hidden" />
        <ShoppingBag size={14} className="hidden sm:inline" />
        <span className="hidden sm:inline">Add to Cart</span>
      </button>
    </article>
  );
}

function CartFab() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-36 lg:bottom-32 right-4 lg:right-6 z-[62] flex items-center justify-center w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-lg transition-colors"
      >
        <ShoppingBag size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-background">
            {totalItems}
          </span>
        )}
      </button>
      <CartPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
