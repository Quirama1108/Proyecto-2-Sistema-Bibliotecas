import { NextRequest } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import prisma from "@/lib/prisma";
import { updateBookSchema } from "@/lib/schemas";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const bookSelect = {
  id: true,
  name: true,
  author: true,
  isbn: true,
  description: true,
  stock: true,
  enabled: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireUser(request);
    const { id } = await context.params;
    const book = await prisma.book.findFirst({
      where: { id, deleted: false },
      select: bookSelect
    });

    if (!book) {
      throw new ApiError(404, "Libro no encontrado");
    }

    return ok({ book });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = updateBookSchema.parse(await request.json());
    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.author !== undefined ? { author: body.author || null } : {}),
        ...(body.isbn !== undefined ? { isbn: body.isbn || null } : {}),
        ...(body.description !== undefined ? { description: body.description || null } : {}),
        ...(body.enabled !== undefined ? { enabled: body.enabled } : {})
      },
      select: bookSelect
    });

    return ok({ book });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const book = await prisma.book.update({
      where: { id },
      data: {
        deleted: true,
        enabled: false
      },
      select: bookSelect
    });

    return ok({ book });
  } catch (error) {
    return handleRouteError(error);
  }
}
