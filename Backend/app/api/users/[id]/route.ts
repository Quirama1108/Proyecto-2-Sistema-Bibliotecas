import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import prisma from "@/lib/prisma";
import { updateUserRoleSchema } from "@/lib/schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await context.params;
    const body = updateUserRoleSchema.parse(await request.json());

    if (admin.id === id && body.role !== "ADMIN") {
      throw new ApiError(409, "No puedes quitarte el rol ADMIN a ti mismo");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: body.role,
        ...(body.enabled !== undefined ? { enabled: body.enabled } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        enabled: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return ok({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
