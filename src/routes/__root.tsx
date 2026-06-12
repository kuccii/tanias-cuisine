import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://taniascuisine.rw";
const SITE_NAME = "Tania's Cuisine & Lounge — Kigali";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tania's Cuisine & Lounge — Kigali's Finest Dining Since 2018" },
      { name: "description", content: "Atmospheric dining, lounge and catering at M&M Plaza, Gishushu, Kigali. African grills, daily buffet, coffee bar. Reserve your table or book an event for up to 800 guests." },
      { name: "author", content: "Tania's Cuisine & Lounge" },
      { name: "theme-color", content: "#0c0b0a" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Tania's Cuisine & Lounge — Kigali's Finest Dining Since 2018" },
      { property: "og:description", content: "Atmospheric dining, lounge and catering at M&M Plaza, Gishushu, Kigali. African grills, daily buffet, coffee bar. Reserve your table or book an event for up to 800 guests." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_RW" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LoungeTania" },
      { name: "twitter:title", content: "Tania's Cuisine & Lounge — Kigali" },
      { name: "twitter:description", content: "Atmospheric dining, lounge & catering in Kigali. African grills, daily buffet, coffee bar." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Tania's Cuisine & Lounge",
  alternateName: "Tania's",
  description: "Kigali's atmospheric dining destination. African grills, curries, daily buffet, coffee bar and catering for up to 800 guests.",
  url: "https://taniascuisine.rw",
  telephone: "+250789289450",
  email: "hello@taniascuisine.rw",
  servesCuisine: ["African", "East African", "Grill", "International"],
  priceRange: "$$",
  foundingDate: "2020-02",
  parentOrganization: {
    "@type": "Organization",
    name: "Tany's Ltd",
    foundingDate: "2018",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "M&M Plaza, Gishushu",
    addressLocality: "Kigali",
    addressCountry: "RW",
  },
  geo: { "@type": "GeoCoordinates", latitude: -1.9441, longitude: 30.0619 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "11:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "11:00", closes: "23:00" },
  ],
  image: "https://taniascuisine.rw/og-image.jpg",
  sameAs: [
    "https://www.instagram.com/taniacuisineandlounge",
    "https://twitter.com/LoungeTania",
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", bestRating: "5", ratingCount: "120" },
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
