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
import { inject } from "@vercel/analytics";

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
      { title: "Tania's Cuisine & Lounge — Best Restaurant in Kigali | African Dining Since 2018" },
      { name: "description", content: "Best restaurant in Kigali at M&M Plaza, KG 8 Avenue, Gishushu, Gasabo. Authentic African grills, Swahili fish, daily chef's buffet (12,000 RWF), coffee bar and catering for up to 800 guests. Reserve by WhatsApp." },
      { name: "author", content: "Tania's Cuisine & Lounge" },
      { name: "theme-color", content: "#0c0b0a" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { name: "google-site-verification", content: "qN0_RCRZgKiIrDhpF2ZYNLAIdlevrl94rrFvst0ipMo" },
      { name: "geo.region", content: "RW-01" },
      { name: "geo.placename", content: "Kigali" },
      { name: "geo.position", content: "-1.9441;30.0619" },
      { name: "ICBM", content: "-1.9441, 30.0619" },
      { name: "keywords", content: "restaurant in Kigali, restaurants in Kigali, Kigali restaurant, Gishushu restaurant, M&M Plaza restaurant, Rwandan restaurant, African cuisine Kigali, best restaurant Kigali, dining Kigali" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Tania's Cuisine & Lounge — Best Restaurant in Kigali" },
      { property: "og:description", content: "Best restaurant in Kigali at M&M Plaza, Gishushu. African grills, daily chef's buffet (12,000 RWF), coffee bar, catering for up to 800 guests." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Tania's Cuisine & Lounge — atmospheric dining and lounge in Kigali, Rwanda" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_RW" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LoungeTania" },
      { name: "twitter:title", content: "Tania's Cuisine & Lounge — Best Restaurant in Kigali" },
      { name: "twitter:description", content: "Best restaurant in Kigali at M&M Plaza, Gishushu. African grills, daily buffet, coffee bar, catering." },
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
  "@type": ["Restaurant", "FoodEstablishment", "LocalBusiness"],
  "@id": "https://taniascuisine.rw/#restaurant",
  name: "Tania's Cuisine & Lounge",
  alternateName: "Tania's",
  description: "Best restaurant in Kigali at M&M Plaza, Gishushu. African grills, Swahili fish, daily chef's buffet (12,000 RWF), coffee bar and catering for up to 800 guests.",
  url: "https://taniascuisine.rw",
  telephone: "+250789289450",
  email: "hello@taniascuisine.rw",
  servesCuisine: ["African", "East African", "Rwandan", "Grill", "Swahili", "International"],
  priceRange: "$$",
  menu: "https://taniascuisine.rw/menu",
  acceptsReservations: true,
  reservation: "https://wa.me/250789289450",
  currenciesAccepted: "RWF",
  foundingDate: "2020-02",
  slogan: "A Culinary Journey of African Flavors",
  parentOrganization: {
    "@type": "Organization",
    name: "Tany's Ltd",
    foundingDate: "2018",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "M&M Plaza, Gishushu, KG 8 Avenue",
    addressLocality: "Kigali",
    addressRegion: "Gasabo",
    addressCountry: "RW",
    postalCode: "",
  },
  geo: { "@type": "GeoCoordinates", latitude: -1.9441, longitude: 30.0619 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "13:00", closes: "23:00" },
  ],
  areaServed: [
    { "@type": "City", name: "Kigali", containedInPlace: { "@type": "Country", name: "Rwanda" } },
    { "@type": "City", name: "Gasabo" },
    { "@type": "City", name: "Gishushu" },
  ],
  hasMap: "https://www.google.com/maps/search/?api=1&query=M%26M%20Plaza%2C%20Gishushu%2C%20Kigali%2C%20Rwanda",
  isAccessibleForFree: true,
  paymentAccepted: ["Cash", "Mobile Money", "Credit Card"],
  containedInPlace: { "@type": "ShoppingCenter", name: "M&M Plaza" },
  image: "https://taniascuisine.rw/og-image.jpg",
  sameAs: [
    "https://www.instagram.com/taniacuisineandlounge",
    "https://twitter.com/LoungeTania",
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", bestRating: "5", ratingCount: "120" },
  knowsLanguage: ["en", "rw", "sw"],
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 20, maxValue: 50 },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dining & Catering Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dine-in Restaurant" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lounge & Bar" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Catering Service" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Daily Buffet" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event Venue Rental" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Coffee Bar" } },
    ],
  },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tania's Cuisine & Lounge",
  url: "https://taniascuisine.rw",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://taniascuisine.rw/menu?search={search_term}",
    "query-input": "required name=search_term",
  },
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-LNZ2MWYDPE`} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LNZ2MWYDPE');
        `}} />
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

  useEffect(() => {
    inject();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
