const fs = require("node:fs");

// Both nitro presets emit dist/server/index.mjs + dist/client. Vercel's script
// also copies into .vercel/output/ with a config.json; Hostinger just runs
// `node server.js`, which reads dist/ directly. This script only asserts the
// layout exists so a silent build misconfiguration fails here, not as a 503.
const required = ["dist/server/index.mjs", "dist/client"];
const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error(`FATAL: missing build output: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("Hostinger (node-server) output verified at dist/server + dist/client");
