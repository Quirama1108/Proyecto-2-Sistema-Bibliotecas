import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { getPagination, paginationMeta } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { createMovementSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      throw new ApiError(400, "bookId es requerido");
    }

    const { page, pageSize, skip, take } = getPagination(request);
    const where = { bookId };
    const [movements, total] = await prisma.$transaction([
      prisma.inventoryMovement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          type: true,
          quantity: true,
          previousStock: true,
          resultingStock: true,
          note: true,
          createdAt: true,
          responsible: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          book: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.inventoryMovement.count({ where })
    ]);

    return ok({ movements, pagination: paginationMeta(total, page, pageSize) });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = createMovementSchema.parse(await request.json());

    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findFirst({
        where: {
          id: body.bookId,
          deleted: false,
          enabled: true
        }
      });

      if (!book) {
        throw new ApiError(404, "Libro no encontrado o inactivo");
      }

      const nextStock =
        body.type === "ENTRADA" ? book.stock + body.quantity : book.stock - body.quantity;

      if (nextStock < 0) {
        throw new ApiError(409, "No hay saldo suficiente para registrar la salida");
      }

      const updatedBook = await tx.book.update({
        where: { id: book.id },
        data: { stock: nextStock },
        select: {
          id: true,
          name: true,
          stock: true
        }
      });
      const movement = await tx.inventoryMovement.create({
        data: {
          bookId: book.id,
          responsibleId: user.id,
          type: body.type,
          quantity: body.quantity,
          previousStock: book.stock,
          resultingStock: nextStock,
          note: body.note || null
        },
        select: {
          id: true,
          type: true,
          quantity: true,
          previousStock: true,
          resultingStock: true,
          note: true,
          createdAt: true,
          responsible: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          book: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return { movement, book: updatedBook };
    });

    return ok(result, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
