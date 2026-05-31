import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { AIAssistant } from "./AIAssistant";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>{children}</main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
