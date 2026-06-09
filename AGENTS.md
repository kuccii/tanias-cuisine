# Project: Tania's Cuisine & Lounge

## Tech Stack
- React 19, TypeScript 5, Vite 7, TanStack Start (SSR framework)
- TanStack Router (file-based routes in src/routes/)
- Tailwind CSS, CSS variables for theming
- AI SDK v6 (@ai-sdk/react, ai) for chat UI
- Hosted on Vercel (Build Output API v3)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Build-only: `node ./node_modules/vite/dist/node/cli.js build`

## Routes & Pages
- `/` — Homepage (hero video, featured dishes, lounge/catering CTAs)
- `/menu` — Full menu with filterable sections
- `/lounge` — Lounge page with daily buffet info
- `/catering` — Catering packages + inquiry form
- `/gallery` — Photo gallery with masonry grid + lightbox
- `/about` — Company info (Tany's Ltd, values, clients)
- `/contact` — Reservation form + contact details
- `/api/chat` — AI chat endpoint (Gemini + fallback rule-based bot)

## Key Data
- `src/data/menu.ts` — Menu items, sections, restaurantInfo object
- `src/data/menu-images.ts` — Image resolution for menu items
- `src/lib/menu-bot.server.ts` — Rule-based chat fallback bot
- Images: `src/assets/menu/` for dishes, `src/assets/area/` for venue, `src/assets/Gallery/` for gallery (loaded via `import.meta.glob` at build time)

## SEO Guidelines
- Every route has a `head()` export with title, description, og:title, og:description
- Root `__root.tsx` has global SEO: og:image, twitter:card, JSON-LD schema, canonical URL
- `public/robots.txt` and `public/sitemap.xml` must stay current with all routes
- JSON-LD Restaurant schema in `__root.tsx` — update geo coordinates, ratings, sameAs if changed

## Company Facts
- Parent: Tany's Ltd (est. 2018)
- Tania's launched: February 2020
- Location: M&M Plaza, Gishushu, Kigali, Rwanda
- Hours: Mon–Sun, 11:00–23:00. Daily buffet 12:00–15:00 (12,000 RWF)
- Phone: +250 788 500 635
- Email: hello@taniascuisine.rw, info@taniascuisine.rw, events@taniascuisine.rw
- Capacity: up to 1,000 guests/event
- Social: @LoungeTania (Twitter/X), @taniacuisineandlounge (Instagram)

## AI Chat
- Uses `@ai-sdk/react` `useChat` hook + `DefaultChatTransport`
- Server route: `src/routes/api/chat.ts`
- AI model: NVIDIA Nim via OpenAI-compatible API (`@ai-sdk/openai-compatible`), model `meta/llama-3.1-70b-instruct`
- Endpoint: `https://integrate.api.nvidia.com/v1`
- Env var: `NVIDIA_API_KEY` (prefix: `nvapi-`)
- Fallback: rule-based bot (`src/lib/menu-bot.server.ts`) when no `NVIDIA_API_KEY`
- Response format: SSE JSON events (`text-start`/`text-delta`/`text-end`)

## Build Notes
- TanStack Start + Nitro, preset = "vercel"
- Build goes to `dist/`, postbuild copies to `.vercel/output/`
- `scripts/prepare-vercel-output.cjs` handles Vercel output structure

## Boundaries
- Never change `nitro.preset` in `vite.config.ts`
- Menu item images stay unchanged (in `src/assets/menu/`)
- Keep business info consistent across all pages
- Don't add Tailwind if CSS variables suffice
