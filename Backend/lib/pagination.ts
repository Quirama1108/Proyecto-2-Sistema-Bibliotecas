import { NextRequest } from "next/server";

const defaultPage = 1;
const defaultPageSize = 10;
const maxPageSize = 50;

export function getPagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page")) || defaultPage, 1);
  const requestedPageSize = Number(searchParams.get("pageSize")) || defaultPageSize;
  const pageSize = Math.min(Math.max(requestedPageSize, 1), maxPageSize);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function paginationMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1)
  };
}
