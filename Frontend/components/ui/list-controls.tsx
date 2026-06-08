import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";

type ListControlsProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchHint?: string;
  pageSize?: number;
  onPageSizeChange?: (value: number) => void;
  sortLabel?: string;
  total?: number;
};

export function ListControls({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  searchHint,
  pageSize,
  onPageSizeChange,
  sortLabel,
  total
}: ListControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        {onSearchChange ? (
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder={searchPlaceholder}
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        ) : null}

        {onPageSizeChange && pageSize ? (
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
            <Select
              label="Registros por página"
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="sm:min-w-40"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} por página
                </option>
              ))}
            </Select>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {typeof total === "number" ? (
            <>
              <strong className="font-medium text-stone-700 dark:text-stone-300">{total}</strong>{" "}
              {total === 1 ? "registro encontrado" : "registros encontrados"}
            </>
          ) : null}
        </p>
        {sortLabel ? <p>{sortLabel}</p> : null}
      </div>

      {searchHint ? (
        <p className="text-xs text-stone-500 dark:text-stone-400">{searchHint}</p>
      ) : null}
    </div>
  );
}
