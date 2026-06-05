import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      throw new ApiError(400, "bookId es requerido");
    }

    const book = await prisma.book.findFirst({
      where: { id: bookId, deleted: false },
      select: {
        id: true,
        name: true,
        stock: true
      }
    });

    if (!book) {
      throw new ApiError(404, "Libro no encontrado");
    }

    const movements = await prisma.inventoryMovement.findMany({
      where: { bookId },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        resultingStock: true
      }
    });
    const pointsByDate = new Map<string, number>();

    for (const movement of movements) {
      pointsByDate.set(movement.createdAt.toISOString().slice(0, 10), movement.resultingStock);
    }

    if (pointsByDate.size === 0) {
      pointsByDate.set(new Date().toISOString().slice(0, 10), book.stock);
    }

    return ok({
      book,
      points: Array.from(pointsByDate.entries()).map(([date, balance]) => ({
        date,
        balance
      }))
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
