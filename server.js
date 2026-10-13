import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import handler from "./dist/server/index.mjs";

const root = resolve("dist/client");
const port = Number(process.env.PORT) || 3000;

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
  return new Request(url, { method: req.method, headers, duplex: "half" });
}

async function sendResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
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
      res.writeHead(500, { "Content-Type": "text/plain" });
    }
    res.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Tania's server listening on http://localhost:${port}`);
});
