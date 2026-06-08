"use client";

import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateBookDialog } from "@/components/books/create-book-dialog";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ListControls } from "@/components/ui/list-controls";
import { MobileCard, MobileCardField, MobileCardList } from "@/components/ui/mobile-card";
import { Panel } from "@/components/ui/panel";
import { Pagination } from "@/components/ui/pagination";
import { StockIndicator } from "@/components/ui/stock-indicator";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ApiClientError, deleteBook, getBooks } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, SORT_LABELS } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { Book, Pagination as PaginationMeta } from "@/lib/types";

export default function MaestrosPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getBooks({
        page,
        pageSize,
        q: debouncedSearch || undefined
      });
      setBooks(result.books);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "No se pudieron cargar los maestros");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBook(deleteTarget.id);
      toast.success("Libro eliminado correctamente");
      setDeleteTarget(null);
      loadBooks();
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "No se pudo eliminar el libro";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maestros"
        description="Consulta el catalogo de libros y sus saldos disponibles."
        action={
          isAdmin ? (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          ) : null
        }
      />

      <Panel className="p-4 sm:p-5">
        <ListControls
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nombre, autor o ISBN..."
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          sortLabel={SORT_LABELS.books}
          total={pagination?.total}
        />
      </Panel>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <Panel>
        {isLoading ? (
          <TableSkeleton />
        ) : books.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={BookOpen}
              title={debouncedSearch ? "Sin resultados" : "No hay maestros registrados"}
              description={
                debouncedSearch
                  ? "Prueba con otro termino de busqueda."
                  : "Los administradores pueden agregar el primer libro."
              }
              action={
                isAdmin && !debouncedSearch ? (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Agregar primer libro
                  </Button>
                ) : null
              }
            />
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <MobileCardList>
              {books.map((book) => (
                <MobileCard key={book.id}>
                  <p className="mb-2 font-medium text-stone-900 dark:text-stone-100">{book.name}</p>
                  <MobileCardField label="Autor" value={book.author || "—"} />
                  <MobileCardField label="ISBN" value={book.isbn || "—"} />
                  <MobileCardField label="Saldo" value={<StockIndicator stock={book.stock} />} />
                  <MobileCardField
                    label="Estado"
                    value={
                      <Badge variant={book.enabled ? "success" : "danger"}>
                        {book.enabled ? "Activo" : "Inactivo"}
                      </Badge>
                    }
                  />
                  <MobileCardField label="Creador" value={book.createdBy.name} />
                  {isAdmin ? (
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditBook(book)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeleteTarget(book)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  ) : null}
                </MobileCard>
              ))}
            </MobileCardList>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <th className="px-3 py-3 font-medium">ID</th>
                    <th className="px-3 py-3 font-medium">Nombre</th>
                    <th className="px-3 py-3 font-medium">Autor</th>
                    <th className="px-3 py-3 font-medium">ISBN</th>
                    <th className="px-3 py-3 font-medium">Saldo</th>
                    <th className="px-3 py-3 font-medium">Estado</th>
                    <th className="px-3 py-3 font-medium">Creador</th>
                    {isAdmin ? <th className="px-3 py-3 font-medium">Acciones</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      className="border-b border-stone-100 transition hover:bg-stone-50/80 dark:border-stone-800 dark:hover:bg-stone-800/40"
                    >
                      <td className="px-3 py-3 font-mono text-xs text-stone-600 dark:text-stone-400">
                        {book.id.slice(0, 8)}...
                      </td>
                      <td className="px-3 py-3 font-medium text-stone-900 dark:text-stone-100">
                        {book.name}
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {book.author || "—"}
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {book.isbn || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <StockIndicator stock={book.stock} />
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={book.enabled ? "success" : "danger"}>
                          {book.enabled ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                        {book.createdBy.name}
                      </td>
                      {isAdmin ? (
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => setEditBook(book)}>
                              <Pencil className="h-3.5 w-3.5" />
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteTarget(book)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination ? <Pagination pagination={pagination} onPageChange={setPage} /> : null}
          </div>
        )}
      </Panel>

      <CreateBookDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={loadBooks}
      />

      <EditBookDialog
        open={Boolean(editBook)}
        onClose={() => setEditBook(null)}
        book={editBook}
        onSuccess={loadBooks}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar libro"
        description={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Esta accion no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
