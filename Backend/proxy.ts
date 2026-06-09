import { NextRequest, NextResponse } from "next/server";

function normalizeOrigin(value?: string | null) {
  const origin = value?.trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "");

  if (!origin || origin === "*" || /^https?:\/\//i.test(origin)) {
    return origin;
  }

  return `https://${origin}`;
}

const allowedOrigins = (process.env.FRONTEND_URL || "*")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

function applyCors(request: NextRequest, response: NextResponse) {
  const requestOrigin = normalizeOrigin(request.headers.get("origin"));
  const allowedOrigin =
    allowedOrigins.includes("*") || !requestOrigin
      ? "*"
      : allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0] || "*";

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Vary", "Origin");
  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return applyCors(request, new NextResponse(null, { status: 204 }));
  }

  return applyCors(request, NextResponse.next());
}

export const config = {
  matcher: "/api/:path*"
};
