"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, updateBook } from "@/lib/api";
import type { Book } from "@/lib/types";

type EditBookDialogProps = {
  open: boolean;
  onClose: () => void;
  book: Book | null;
  onSuccess: () => void;
};

export function EditBookDialog({ open, onClose, book, onSuccess }: EditBookDialogProps) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState("true");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!book) return;
    setName(book.name);
    setAuthor(book.author || "");
    setIsbn(book.isbn || "");
    setDescription(book.description || "");
    setEnabled(book.enabled ? "true" : "false");
  }, [book]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!book) return;
    setIsLoading(true);
    try {
      await updateBook(book.id, {
        name,
        author: author.trim() || "",
        isbn: isbn.trim() || "",
        description: description.trim() || "",
        enabled: enabled === "true"
      });
      toast.success("Libro actualizado correctamente");
      onClose();
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "No se pudo actualizar el libro";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar maestro"
      description={book?.name}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <Input label="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        <Textarea
          label="Descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          label="Estado"
          value={enabled}
          onChange={(e) => setEnabled(e.target.value)}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
