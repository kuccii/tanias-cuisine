// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  // serverEntry: false — root `server.js` is the standalone Hostinger runtime
  // wrapper (it imports ./dist/server/index.mjs at run time). Without this,
  // Nitro auto-detects `./server` from the project root and tries to BUILD it,
  // which fails (and would be wrong even if it succeeded). The SSR entry stays
  // src/server.ts. Do not remove unless server.js is renamed/moved.
  nitro: { preset: "vercel", serverEntry: false },
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      ViteImageOptimizer({
        jpg: { quality: 80, mozjpeg: true },
        png: { quality: 80, palette: true },
        webp: { quality: 80 },
        include: /\.(jpe?g|png|webp)$/i,
      }),
    ],
  },
});
