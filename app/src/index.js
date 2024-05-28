import express from "express";
import { createServer } from "node:http";
import { publicPath } from "/workspaces/solstice/app/static/lib/index.js";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import { createBareServer } from "@tomphttp/bare-server-node"; // Added import for bare server

const app = express();
const bareServer = createBareServer("/bare/"); // Create the bare server instance

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url.includes("www.topcreativeformat.com")) { 
    res.setHeader("Access-Control-Allow-Origin", "https://www.topcreativeformat.com"); 
  }

  if (req.url.includes("pl23320588.highcpmgate.com")) { 
    res.setHeader("Access-Control-Allow-Origin", "https://pl23320588.highcpmgate.com"); 
  }

  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res); // Route through bare server if applicable
  } else {
    app(req, res); // Otherwise, use the Express app
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head); // Route WebSocket upgrades through bare server if applicable
  } else if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`    http://localhost:${address.port}`);
  console.log(`    http://${hostname()}:${address.port}`);
  console.log(
    `    http://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  process.exit(0);
}

server.listen({
  port,
});
