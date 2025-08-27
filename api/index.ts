import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle different API routes
  if (url?.includes("/ping")) {
    const ping = process.env.PING_MESSAGE ?? "ping";
    return res.json({ message: ping });
  }

  if (url?.includes("/demo")) {
    return res.json({
      message: "Demo endpoint working",
      timestamp: new Date().toISOString(),
    });
  }

  // Default response
  return res.json({
    message: "SBIE CRM API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
}
