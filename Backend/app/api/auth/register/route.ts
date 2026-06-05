import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { fail, handleRouteError, ok } from "@/lib/http";
import { signJwt } from "@/lib/jwt";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return fail("Ya existe un usuario con este correo", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        image: body.image || null,
        passwordHash: hashPassword(body.password),
        role: "USER"
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true
      }
    });
    const token = signJwt({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return ok({ token, user }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
