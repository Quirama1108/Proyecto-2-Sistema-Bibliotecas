export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_LABELS = {
  books: "Orden: fecha de creación (más recientes primero)",
  movements: "Orden: fecha del movimiento (más recientes primero)",
  users: "Orden: fecha de creación (más recientes primero)"
} as const;
