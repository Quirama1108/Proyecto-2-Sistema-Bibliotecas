import { NextRequest } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { getPagination, paginationMeta } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { createBookSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const { page, pageSize, skip, take } = getPagination(request);
    const where = {
      deleted: false,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { author: { contains: q, mode: "insensitive" as const } },
              { isbn: { contains: q, mode: "insensitive" as const } }
            ]
          }
        : {})
    };
    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
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
        }
      }),
      prisma.book.count({ where })
    ]);

    return ok({ books, pagination: paginationMeta(total, page, pageSize) });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const body = createBookSchema.parse(await request.json());

    const book = await prisma.$transaction(async (tx) => {
      const createdBook = await tx.book.create({
        data: {
          name: body.name,
          author: body.author || null,
          isbn: body.isbn || null,
          description: body.description || null,
          stock: body.initialStock,
          createdById: user.id
        }
      });

      if (body.initialStock > 0) {
        await tx.inventoryMovement.create({
          data: {
            bookId: createdBook.id,
            responsibleId: user.id,
            type: "ENTRADA",
            quantity: body.initialStock,
            previousStock: 0,
            resultingStock: body.initialStock,
            note: "Saldo inicial"
          }
        });
      }

      return tx.book.findUnique({
        where: { id: createdBook.id },
        select: {
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
        }
      });
    });

    if (!book) {
      throw new ApiError(500, "No se pudo crear el libro");
    }

    return ok({ book }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
