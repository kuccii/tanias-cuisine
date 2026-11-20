import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Both nitro presets ("vercel" for Vercel, "node-server" for Hostinger) emit
// the same layout: dist/server/index.mjs (SSR handler) + dist/client (static).
const serverEntry = join(__dirname, "dist", "server", "index.mjs");
const root = join(__dirname, "dist", "client");
const port = Number(process.env.PORT) || 3000;

let handler;
try {
  const mod = await import(pathToFileURL(serverEntry).href);
  handler = mod.default ?? mod;
  if (typeof handler.fetch !== "function") {
    console.error("FATAL: SSR handler does not export a fetch function");
    process.exit(1);
  }
} catch (err) {
  console.error(`FATAL: Cannot load SSR handler from ${serverEntry}`);
  console.error(err);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/vnd.microsoft.icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

// Baseline security headers applied to every response (static + SSR).
// `frame-ancestors` is deliberately the only CSP directive: a full CSP would
// break Google Tag Manager / Google Maps, which need to load third-party
// scripts and frames.
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Security-Policy": "frame-ancestors 'self'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000",
};

async function tryStatic(pathname) {
  if (pathname.includes("..")) return null;
  const filePath = join(root, normalize(pathname).replace(/^\/+/, ""));
  if (!filePath.startsWith(root + sep) && filePath !== root) return null;
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return null;
    return { filePath, size: s.size };
  } catch {
    return null;
  }
}

function toRequest(req, host) {
  const url = `http://${host}${req.url}`;
  const headers = new Headers();
  for (let i = 0; i < req.rawHeaders.length; i += 2) {
    headers.append(req.rawHeaders[i], req.rawHeaders[i + 1]);
  }
  const init = { method: req.method, headers };
  // Forward the request body for POST/PUT/PATCH — without this, handlers
  // (e.g. /api/chat) receive a body-less Request and every POST fails with
  // "Unexpected end of JSON input". GET/HEAD must not have a body.
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }
  return new Request(url, init);
}

async function sendResponse(res, response) {
  res.writeHead(response.status, { ...SECURITY_HEADERS, ...Object.fromEntries(response.headers) });
  if (response.body) {
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } else {
    res.end();
  }
}

const server = createServer(async (req, res) => {
  try {
    const host = req.headers.host || `localhost:${port}`;
    const pathname = new URL(req.url, `http://${host}`).pathname;

    if (req.method === "GET" || req.method === "HEAD") {
      const asset = await tryStatic(pathname === "/" ? "/index.html" : pathname);
      if (asset) {
        res.writeHead(200, {
          ...SECURITY_HEADERS,
          "Content-Type": MIME[extname(asset.filePath).toLowerCase()] || "application/octet-stream",
          "Content-Length": asset.size,
          "Cache-Control": pathname.startsWith("/assets/")
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600",
        });
        if (req.method === "HEAD") return res.end();
        return createReadStream(asset.filePath).pipe(res);
      }
    }

    const response = await handler.fetch(toRequest(req, host));
    return await sendResponse(res, response);
  } catch (err) {
    console.error("Request error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { ...SECURITY_HEADERS, "Content-Type": "text/plain" });
    }
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Tania's server listening on http://localhost:${port}`);
});
