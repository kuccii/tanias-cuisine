"use client";

import { resolveItemImage } from "@/data/menu-images";
import type { MenuSection, MenuItem } from "@/data/menu";
import { Badge } from "@/components/ui/badge";
import { Star, Utensils, Image as ImageIcon } from "lucide-react";

interface LivePreviewProps {
  section: MenuSection | null;
  sectionIndex?: number;
}

export function LivePreview({ section, sectionIndex = 0 }: LivePreviewProps) {
  if (!section) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center bg-muted/20">
        <Utensils className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Select a section to preview</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Changes in the editor will reflect here live</p>
      </div>
    );
  }

  const formatPrice = (price: string | number) => {
    // Handle prices that might already have RWF prefix or FRW suffix
    if (typeof price === "number") {
      return `RWF ${price.toLocaleString()}`;
    }
    const match = price.match(/(\d[\d,]*)/);
    if (match) {
      return `RWF ${parseInt(match[1].replace(/,/g, ""), 10).toLocaleString()}`;
    }
    return price;
  };

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-6rem)] sticky top-6">
      <div className="bg-muted/40 px-4 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Live Preview
        </span>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
          {section.compact ? "Compact Layout" : "Standard Layout"}
        </Badge>
      </div>

      <div className="overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Section Header Image */}
        {section.image ? (
          <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-border/40">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[21/9] rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-muted-foreground/50">
            <div className="flex items-center gap-2 text-xs">
              <ImageIcon className="h-4 w-4" />
              <span>No header image uploaded</span>
            </div>
          </div>
        )}

        {/* Section Header Info */}
        <div className="border-b border-primary/20 pb-4">
          <p className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-1">
            {String(sectionIndex + 1).padStart(2, "0")} · {section.category || "Uncategorized"}
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {section.title || "Untitled Section"}
          </h2>
          {section.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
          )}
        </div>

        {/* Groups or Items */}
        {section.groups && section.groups.length > 0 ? (
          <div className="space-y-6">
            {section.groups.map((group) => (
              <div key={group.name} className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-foreground border-b border-primary/20 pb-1">
                  <span className="italic text-primary">— </span>
                  {group.name}
                </h3>
                <PreviewGrid
                  items={group.items}
                  sectionId={section.id}
                  groupName={group.name}
                  compact={section.compact}
                  formatPrice={formatPrice}
                />
              </div>
            ))}
          </div>
        ) : (
          <PreviewGrid
            items={section.items ?? []}
            sectionId={section.id}
            compact={section.compact}
            formatPrice={formatPrice}
          />
        )}

        {/* Special Box */}
        {section.special_box && (
          <div className="relative border border-primary/40 bg-primary/[0.04] p-4 rounded-lg mt-6">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary font-semibold mb-3">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span>{section.special_box.title || "Special Offer"}</span>
            </div>
            <PreviewGrid
              items={section.special_box.items || []}
              sectionId={section.id}
              compact={true}
              formatPrice={formatPrice}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewGrid({
  items,
  sectionId,
  groupName,
  compact,
  formatPrice,
}: {
  items: MenuItem[];
  sectionId: string;
  groupName?: string;
  compact?: boolean;
  formatPrice: (p: string | number) => string;
}) {
  if (!items || items.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic py-2">No items in this section</p>
    );
  }

  return (
    <div
      className={`grid gap-3 ${
        compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item, idx) => {
        const image = resolveItemImage(item.name, sectionId, groupName);

        return (
          <div
            key={item.name || idx}
            className="group bg-card border border-border/40 rounded-lg p-3 flex gap-3 hover:border-primary/40 transition-colors"
          >
            {image && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted">
                <img
                  src={image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-sm font-semibold text-foreground truncate">
                    {item.name || "Untitled Item"}
                  </h4>
                  <span className="font-mono text-xs font-bold text-primary shrink-0">
                    {formatPrice(item.price)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                )}
                {item.note && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}