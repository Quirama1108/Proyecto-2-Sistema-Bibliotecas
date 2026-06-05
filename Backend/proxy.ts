import { NextRequest, NextResponse } from "next/server";

const allowedOrigin = process.env.FRONTEND_URL || "*";

function applyCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return applyCors(new NextResponse(null, { status: 204 }));
  }

  return applyCors(NextResponse.next());
}

export const config = {
  matcher: "/api/:path*"
};
