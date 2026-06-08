"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ListControls } from "@/components/ui/list-controls";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, createMovement, getBooks } from "@/lib/api";
import { SORT_LABELS } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { Book, MovementType } from "@/lib/types";

type CreateMovementDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultBookId: string;
  onSuccess: (bookId: string) => void;
};

export function CreateMovementDialog({
  open,
  onClose,
  defaultBookId,
  onSuccess
}: CreateMovementDialogProps) {
  const [pickerBooks, setPickerBooks] = useState<Book[]>([]);
  const [booksTotal, setBooksTotal] = useState(0);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const debouncedBookSearch = useDebouncedValue(bookSearch.trim());
  const [bookId, setBookId] = useState(defaultBookId);
  const [type, setType] = useState<MovementType>("ENTRADA");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeBooks = pickerBooks.filter((book) => book.enabled);
  const selectedBook = activeBooks.find((book) => book.id === bookId);

  useEffect(() => {
    if (!open) return;
    setBookSearch("");
    setType("ENTRADA");
    setQuantity("1");
    setNote("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setIsLoadingBooks(true);
    getBooks({ page: 1, pageSize: 50, q: debouncedBookSearch || undefined })
      .then((result) => {
        setPickerBooks(result.books);
        setBooksTotal(result.pagination.total);
        const enabled = result.books.filter((book) => book.enabled);
        const preferred = enabled.some((b) => b.id === defaultBookId)
          ? defaultBookId
          : enabled[0]?.id || "";
        setBookId(preferred);
      })
      .catch(() => {
        setPickerBooks([]);
        setBooksTotal(0);
      })
      .finally(() => setIsLoadingBooks(false));
  }, [open, debouncedBookSearch, defaultBookId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!bookId) return;
    setIsLoading(true);
    try {
      await createMovement({
        bookId,
        type,
        quantity: Number(quantity),
        note: note.trim() || undefined
      });
      toast.success("Movimiento creado correctamente");
      onClose();
      onSuccess(bookId);
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "No se pudo crear el movimiento";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={selectedBook ? `Agregar movimiento - ${selectedBook.name}` : "Agregar movimiento"}
      description="Registra una entrada o salida de inventario para el libro seleccionado."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ListControls
          search={bookSearch}
          onSearchChange={setBookSearch}
          searchPlaceholder="Buscar libro por nombre, autor o ISBN..."
          sortLabel={SORT_LABELS.books}
          total={booksTotal}
        />

        <Select
          label="Libro"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
          disabled={isLoadingBooks || activeBooks.length === 0}
        >
          {isLoadingBooks ? (
            <option value="">Cargando libros...</option>
          ) : activeBooks.length === 0 ? (
            <option value="">Sin libros activos</option>
          ) : (
            activeBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name} (saldo: {book.stock})
              </option>
            ))
          )}
        </Select>

        {selectedBook ? (
          <p className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            Saldo actual: <strong>{selectedBook.stock}</strong> ejemplares
          </p>
        ) : null}

        <Select
          label="Tipo de movimiento"
          value={type}
          onChange={(e) => setType(e.target.value as MovementType)}
        >
          <option value="ENTRADA">Entrada (devolución / ingreso)</option>
          <option value="SALIDA">Salida (préstamo / retiro)</option>
        </Select>
        <Input
          label="Cantidad"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <Textarea
          label="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. Préstamo a usuario"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!bookId}>
            Crear movimiento
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
