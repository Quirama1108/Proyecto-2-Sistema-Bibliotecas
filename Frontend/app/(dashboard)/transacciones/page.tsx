"use client";

import { ArrowLeftRight, BookOpen, Layers, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CreateMovementDialog } from "@/components/movements/create-movement-dialog";
import { BalanceChart } from "@/components/movements/balance-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ListControls } from "@/components/ui/list-controls";
import { MovementTypeBadge } from "@/components/ui/movement-type-badge";
import { MobileCard, MobileCardField, MobileCardList } from "@/components/ui/mobile-card";
import { Panel } from "@/components/ui/panel";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardsSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { ApiClientError, getBooks, getMovementSummary, getMovements } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, SORT_LABELS } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { BalancePoint, Book, Movement, Pagination as PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function TransaccionesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksPagination, setBooksPagination] = useState<PaginationMeta | null>(null);
  const [booksPage, setBooksPage] = useState(1);
  const [booksPageSize, setBooksPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [booksSearch, setBooksSearch] = useState("");
  const debouncedBooksSearch = useDebouncedValue(booksSearch.trim());

  const [selectedBookId, setSelectedBookId] = useState("");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [movementsPagination, setMovementsPagination] = useState<PaginationMeta | null>(null);
  const [movementsPage, setMovementsPage] = useState(1);
  const [movementsPageSize, setMovementsPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [points, setPoints] = useState<BalancePoint[]>([]);

  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedBook = books.find((book) => book.id === selectedBookId);
  const activeBooks = books.filter((book) => book.enabled);

  const loadBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    try {
      const result = await getBooks({
        page: booksPage,
        pageSize: booksPageSize,
        q: debouncedBooksSearch || undefined
      });
      setBooks(result.books);
      setBooksPagination(result.pagination);
      setSelectedBookId((current) => {
        if (current && result.books.some((book) => book.id === current)) return current;
        return result.books[0]?.id || "";
      });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "No se pudieron cargar los libros");
    } finally {
      setIsLoadingBooks(false);
    }
  }, [booksPage, booksPageSize, debouncedBooksSearch]);

  const loadMovementsData = useCallback(async () => {
    if (!selectedBookId) return;
    setIsLoadingData(true);
    setError("");
    try {
      const [movementsResult, summaryResult] = await Promise.all([
        getMovements(selectedBookId, { page: movementsPage, pageSize: movementsPageSize }),
        getMovementSummary(selectedBookId)
      ]);
      setMovements(movementsResult.movements);
      setMovementsPagination(movementsResult.pagination);
      setPoints(summaryResult.points);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "No se pudieron cargar los movimientos");
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedBookId, movementsPage, movementsPageSize]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    setBooksPage(1);
  }, [debouncedBooksSearch, booksPageSize]);

  useEffect(() => {
    setMovementsPage(1);
  }, [selectedBookId, movementsPageSize]);

  useEffect(() => {
    loadMovementsData();
  }, [loadMovementsData]);

  if (isLoadingBooks && books.length === 0) {
    return (
      <div className="space-y-6">
        <StatCardsSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transacciones de inventario"
        description="Selecciona un libro, registra entradas o salidas y revisa cómo cambia su saldo."
        action={
          <Button onClick={() => setDialogOpen(true)} disabled={activeBooks.length === 0}>
            <Plus className="h-4 w-4" />
            Agregar movimiento
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StepCard
          icon={BookOpen}
          title="1. Elige un libro"
          description="Busca por nombre, autor o ISBN y selecciona el libro que quieres revisar."
          tone="sky"
        />
        <StepCard
          icon={Plus}
          title="2. Registra el movimiento"
          description="Usa entrada para ingresos o devoluciones, y salida para préstamos o retiros."
          tone="amber"
        />
        <StepCard
          icon={ArrowLeftRight}
          title="3. Revisa historial y gráfica"
          description="La tabla muestra quién hizo cada movimiento y la gráfica resume el saldo diario."
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Libros en catálogo"
          value={booksPagination?.total ?? 0}
          icon={BookOpen}
          tone="sky"
        />
        <StatCard
          label="Saldo actual"
          value={selectedBook?.stock ?? "—"}
          icon={Layers}
          tone="amber"
        />
        <StatCard
          label="Movimientos registrados"
          value={movementsPagination?.total ?? 0}
          icon={ArrowLeftRight}
          tone="emerald"
        />
      </div>

      <Panel className="space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
            Libro seleccionado
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            El historial, el botón de movimiento y la gráfica se actualizan con este libro.
          </p>
        </div>
        <ListControls
          search={booksSearch}
          onSearchChange={setBooksSearch}
          searchPlaceholder="Buscar libro por nombre, autor o ISBN..."
          pageSize={booksPageSize}
          onPageSizeChange={setBooksPageSize}
          sortLabel={SORT_LABELS.books}
          total={booksPagination?.total}
        />
        <Select
          label="Selecciona el libro"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          disabled={isLoadingBooks}
        >
          {books.length === 0 ? (
            <option value="">Sin libros disponibles</option>
          ) : (
            books.map((book) => (
              <option key={book.id} value={book.id} disabled={!book.enabled}>
                {book.name} (saldo: {book.stock}){!book.enabled ? " — Inactivo" : ""}
              </option>
            ))
          )}
        </Select>
        {selectedBook ? (
          <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm dark:border-stone-800 dark:bg-stone-900/70 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Libro
              </p>
              <p className="mt-1 font-medium text-stone-900 dark:text-stone-100">
                {selectedBook.name}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Autor
              </p>
              <p className="mt-1 text-stone-700 dark:text-stone-300">
                {selectedBook.author || "Sin autor"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Saldo disponible
              </p>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">
                {selectedBook.stock} ejemplares
              </p>
            </div>
          </div>
        ) : null}
        {booksPagination ? (
          <Pagination pagination={booksPagination} onPageChange={setBooksPage} />
        ) : null}
      </Panel>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <Panel>
        <div className="border-b border-stone-200 p-4 dark:border-stone-800 sm:px-5 sm:pt-5">
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              Historial de movimientos
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Cada fila indica la fecha, el tipo de movimiento, la cantidad y el responsable.
            </p>
          </div>
          <ListControls
            pageSize={movementsPageSize}
            onPageSizeChange={setMovementsPageSize}
            sortLabel={SORT_LABELS.movements}
            total={movementsPagination?.total}
            searchHint="Los movimientos se ordenan por fecha desde el servidor. La búsqueda de movimientos no está disponible en la API."
          />
        </div>

        {isLoadingData ? (
          <TableSkeleton />
        ) : movements.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={ArrowLeftRight}
              title="No hay movimientos"
              description="Selecciona un libro y registra el primer movimiento."
            />
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <MobileCardList>
              {movements.map((movement) => (
                <MobileCard key={movement.id}>
                  <MobileCardField label="Tipo" value={<MovementTypeBadge type={movement.type} />} />
                  <MobileCardField label="Fecha" value={formatDate(movement.createdAt)} />
                  <MobileCardField label="Cantidad" value={movement.quantity} />
                  <MobileCardField label="Saldo después" value={movement.resultingStock} />
                  <MobileCardField label="Responsable" value={movement.responsible.name} />
                </MobileCard>
              ))}
            </MobileCardList>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <th className="px-3 py-3 font-medium">Movimiento</th>
                    <th className="px-3 py-3 font-medium">Fecha</th>
                    <th className="px-3 py-3 font-medium">Tipo</th>
                    <th className="px-3 py-3 font-medium">Cantidad</th>
                    <th className="px-3 py-3 font-medium">Saldo después</th>
                    <th className="px-3 py-3 font-medium">Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-b border-stone-100 transition hover:bg-stone-50/80 dark:border-stone-800 dark:hover:bg-stone-800/40"
                    >
                      <td className="px-3 py-3 font-mono text-xs text-stone-600 dark:text-stone-400">
                        {movement.id.slice(0, 8)}...
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {formatDate(movement.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <MovementTypeBadge type={movement.type} />
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {movement.quantity}
                      </td>
                      <td className="px-3 py-3 font-medium text-stone-900 dark:text-stone-100">
                        {movement.resultingStock}
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {movement.responsible.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {movementsPagination ? (
              <Pagination pagination={movementsPagination} onPageChange={setMovementsPage} />
            ) : null}
          </div>
        )}
      </Panel>

      {selectedBook ? <BalanceChart points={points} bookName={selectedBook.name} /> : null}

      <CreateMovementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        defaultBookId={selectedBookId}
        onSuccess={(createdBookId) => {
          if (createdBookId !== selectedBookId) {
            setSelectedBookId(createdBookId);
            setBooksSearch("");
            setBooksPage(1);
          } else {
            loadMovementsData();
          }
          loadBooks();
        }}
      />

      {selectedBook && !selectedBook.enabled ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          El libro seleccionado está inactivo. No se pueden registrar nuevos movimientos.
        </p>
      ) : null}
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  description,
  tone
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  tone: "sky" | "amber" | "emerald";
}) {
  const tones = {
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
  };

  return (
    <Panel className="p-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{title}</p>
          <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
            {description}
          </p>
        </div>
      </div>
    </Panel>
  );
}
