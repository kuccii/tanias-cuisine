import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { AIAssistant } from "./AIAssistant";
import { MobileTabs } from "./MobileTabs";

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main
        key={location.pathname}
        className="pb-24 lg:pb-0 animate-in fade-in duration-500"
      >
        {children}
      </main>
      <Footer />
      <AIAssistant />
      <MobileTabs />
    </div>
  );
}
