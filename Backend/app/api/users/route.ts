import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/http";
import { getPagination, paginationMeta } from "@/lib/pagination";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { page, pageSize, skip, take } = getPagination(request);
    const where = { deleted: false };
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
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
      }),
      prisma.user.count({ where })
    ]);

    return ok({ users, pagination: paginationMeta(total, page, pageSize) });
  } catch (error) {
    return handleRouteError(error);
  }
}
