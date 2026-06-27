import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { House, UtensilsCrossed, Sofa, Image, Ellipsis, X, ArrowRight } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: House },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/lounge", label: "Lounge", icon: Sofa },
  { to: "/gallery", label: "Gallery", icon: Image },
] as const;

const moreLinks = [
  { to: "/catering", label: "Catering" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function MobileTabs() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const currentPath = location.pathname;
  const isMoreActive = moreLinks.some((l) => currentPath === l.to);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[70] glass border-t border-border/40 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const active = tab.to === "/" ? currentPath === "/" : currentPath.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                  active ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <tab.icon size={20} />
                <span className="text-[10px] font-mono-display tracking-[0.15em] uppercase">{tab.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
              isMoreActive || moreOpen ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            <Ellipsis size={20} />
            <span className="text-[10px] font-mono-display tracking-[0.15em] uppercase">More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[71]" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-background border-t border-border/40 rounded-t-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] animate-in fade-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-xl">More</span>
              <button onClick={() => setMoreOpen(false)} className="text-foreground/60 hover:text-foreground">
                <X size={22} />
              </button>
            </div>
            <div className="space-y-1">
              {moreLinks.map((l) => {
                const active = currentPath === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-lg transition-colors ${
                      active ? "bg-primary/10 text-primary" : "hover:bg-surface/50"
                    }`}
                  >
                    <span className="font-mono-display text-[13px] tracking-[0.15em] uppercase">{l.label}</span>
                    <ArrowRight size={16} className="text-foreground/40" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
