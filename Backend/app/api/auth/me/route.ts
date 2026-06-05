import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    return ok({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
