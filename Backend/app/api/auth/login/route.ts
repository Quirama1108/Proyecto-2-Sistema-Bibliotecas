import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, handleRouteError, ok } from "@/lib/http";
import { signJwt } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user || user.deleted || !user.enabled || !verifyPassword(body.password, user.passwordHash)) {
      return fail("Credenciales invalidas", 401);
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    };
    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return ok({ token, user: sessionUser });
  } catch (error) {
    return handleRouteError(error);
  }
}
