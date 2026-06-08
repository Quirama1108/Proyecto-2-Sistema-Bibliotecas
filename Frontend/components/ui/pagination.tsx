import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination as PaginationMeta } from "@/lib/types";

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (pagination.total === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="text-center text-sm text-stone-500 dark:text-stone-400 sm:text-left">
        Pagina {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
      </p>
      <div className="flex justify-center gap-2 sm:justify-end">
        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
        {pagination.totalPages <= 1 ? (
          <span className="self-center text-xs text-stone-400 sm:hidden">Una sola pagina</span>
        ) : null}
      </div>
    </div>
  );
}
