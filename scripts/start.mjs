import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// Hostinger (node-server preset) emits dist/server/index.mjs — a self-contained
// Nitro HTTP server that serves its own static assets and honors process.env.PORT.
// Vercel (vercel preset) emits a Vercel-style { fetch } handler, which needs the
// server.js wrapper to run as a standalone server. Pick by build layout.
const nitroServer = join(root, "dist", "server", "index.mjs");
const vercelWrapper = join(root, "server.js");
const useWrapper = !existsSync(nitroServer) || process.env.START_MODE === "wrapper";

const target = useWrapper ? vercelWrapper : nitroServer;
console.log(`[start] launching ${target}`);
const child = spawn(process.execPath, [target], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
