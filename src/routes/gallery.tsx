import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { BreadcrumbSchema } from "@/components/site/BreadcrumbSchema";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Tania's Cuisine & Lounge | Best Restaurant in Gishushu, Kigali" },
      { name: "description", content: "Browse the photo gallery of Kigali's best restaurant at M&M Plaza, Gishushu. Lounge, atmosphere, dishes, and everyday moments at Tania's Cuisine & Lounge." },
      { property: "og:title", content: "Gallery — Best Restaurant in Gishushu, Kigali | Tania's Cuisine & Lounge" },
      { property: "og:description", content: "Browse the gallery of Kigali's best restaurant — lounge, atmosphere, dishes at M&M Plaza, Gishushu." },
      { property: "og:url", content: "https://taniascuisine.rw/gallery" },
      { property: "og:image", content: "https://taniascuisine.rw/og-image.jpg" },
      { name: "twitter:title", content: "Gallery — Best Restaurant in Gishushu | Tania's Cuisine & Lounge" },
      { name: "twitter:description", content: "Photo gallery of Kigali's best restaurant at M&M Plaza, Gishushu." },
      { name: "twitter:image", content: "https://taniascuisine.rw/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://taniascuisine.rw/gallery" }],
  }),
  component: GalleryPage,
});

const galleryImages = Object.values(
  import.meta.glob<{ default: string }>(
    "/src/assets/Gallery/*.{jpeg,jpg,png,PNG,JPEG,JPG}",
    { eager: true, query: "?url" }
  )
).map((m) => m.default);

function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  function prev() {
    setSelected((s) => (s !== null && s > 0 ? s - 1 : null));
  }

  function next() {
    setSelected((s) => (s !== null && s < galleryImages.length - 1 ? s + 1 : null));
  }

  return (
    <SiteLayout>
      <BreadcrumbSchema items={[
        { name: "Home", item: "https://taniascuisine.rw" },
        { name: "Gallery", item: "https://taniascuisine.rw/gallery" },
      ]} />
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow mb-6">Gallery</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl text-balance leading-[0.95]">
            Our <span className="italic text-primary">space,</span> in frames.
          </h1>
          <p className="mt-6 max-w-xl text-foreground/70 leading-relaxed">
            A glimpse into Tania's — the lounge, the table, the light, and the
            moments that make this place what it is.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1500px] columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setSelected(i)}
              className="block w-full overflow-hidden group cursor-pointer border-none p-0 bg-transparent text-left"
            >
              <img
                src={src}
                alt={`Tania's Cuisine & Lounge — photo ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover image-mood transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-110"
              />
            </button>
          ))}
        </div>
      </section>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-foreground/70 hover:text-primary z-10"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {selected > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {selected < galleryImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-primary z-10"
              aria-label="Next image"
            >
              <ChevronRight size={40} />
            </button>
          )}

          <img
            src={galleryImages[selected]}
            alt={`Tania's Cuisine & Lounge — photo ${selected + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 font-mono-display text-[10px] tracking-[0.3em] uppercase text-foreground/50">
            {selected + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
