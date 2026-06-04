import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-ink border-t border-border/40 pt-20 pb-12 mt-20">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h4 className="font-display text-2xl tracking-[0.16em] uppercase mb-5">
              Tania's<span className="text-primary"> Cuisine & Lounge</span>
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Part of Tany's Ltd (est. 2018). Kigali's finest dining
              destination since February 2020. Catering excellence,
              atmospheric lounge, unforgettable evenings.
            </p>
          </div>
          <div>
            <h5 className="eyebrow mb-5">Explore</h5>
            <ul className="space-y-3 text-sm">
              <li><Link to="/menu" className="text-muted-foreground hover:text-primary">Menu</Link></li>
              <li><Link to="/lounge" className="text-muted-foreground hover:text-primary">The Lounge</Link></li>
              <li><Link to="/catering" className="text-muted-foreground hover:text-primary">Catering</Link></li>
              <li><Link to="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="eyebrow mb-5">Contact</h5>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>+250 788 500 635</li>
              <li>hello@taniascuisine.rw</li>
              <li>info@taniascuisine.rw</li>
              <li>M&amp;M Plaza, Gishushu, Kigali</li>
              <li>Mon–Fri 10h–23h · Sat–Sun 13h–23h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between gap-4 font-mono-display text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
          <span>© {new Date().getFullYear()} Tania's Cuisine & Lounge</span>
          <span>Gishushu, Kigali · Since Feb 2020 · Tany's Ltd</span>
        </div>
      </div>
    </footer>
  );
}
