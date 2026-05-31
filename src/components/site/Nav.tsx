import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/lounge", label: "Lounge" },
  { to: "/catering", label: "Catering" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass py-3" : "py-6"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="font-display text-xl md:text-2xl tracking-[0.18em] uppercase">
            Tania's<span className="text-primary">.</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-mono-display text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-primary transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="font-mono-display text-[10px] tracking-[0.25em] uppercase border border-border/60 px-5 py-3 hover:border-primary hover:text-primary transition-colors"
            >
              Reserve
            </Link>
            <Link
              to="/catering"
              className="font-mono-display text-[10px] tracking-[0.25em] uppercase bg-primary text-primary-foreground px-5 py-3 hover:shadow-glow transition-shadow"
            >
              Catering Inquiry
            </Link>
          </div>

          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col p-8 lg:hidden">
          <div className="flex items-center justify-between mb-16">
            <Link to="/" onClick={() => setOpen(false)} className="font-display text-xl tracking-[0.18em] uppercase">
              Tania's<span className="text-primary">.</span>
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={26} />
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-4xl tracking-tight"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="text-center font-mono-display text-[11px] tracking-[0.25em] uppercase border border-border px-5 py-4"
            >
              Reserve a Table
            </Link>
            <Link
              to="/catering"
              onClick={() => setOpen(false)}
              className="text-center font-mono-display text-[11px] tracking-[0.25em] uppercase bg-primary text-primary-foreground px-5 py-4"
            >
              Catering Inquiry
            </Link>
          </div>
        </div>
      )}

      {/* Mobile sticky CTAs */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass grid grid-cols-2 gap-2 p-3">
        <Link
          to="/contact"
          className="text-center font-mono-display text-[10px] tracking-[0.22em] uppercase border border-border py-3"
        >
          Reserve
        </Link>
        <Link
          to="/catering"
          className="text-center font-mono-display text-[10px] tracking-[0.22em] uppercase bg-primary text-primary-foreground py-3"
        >
          Catering
        </Link>
      </div>
    </>
  );
}
