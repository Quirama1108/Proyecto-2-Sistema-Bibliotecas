import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ApiError } from "@/lib/http";
import { verifyJwt } from "@/lib/jwt";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "USER";
};

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
}

export async function requireUser(request: NextRequest): Promise<SessionUser> {
  const token = getBearerToken(request);

  if (!token) {
    throw new ApiError(401, "Token de autenticacion requerido");
  }

  const payload = verifyJwt(token);

  if (!payload) {
    throw new ApiError(401, "Token invalido o expirado");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      enabled: true,
      deleted: true
    }
  });

  if (!user || user.deleted || !user.enabled) {
    throw new ApiError(401, "Usuario no disponible");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role
  };
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireUser(request);

  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Esta accion requiere rol ADMIN");
  }

  return user;
}
