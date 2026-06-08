"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, createBook } from "@/lib/api";

type CreateBookDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateBookDialog({ open, onClose, onSuccess }: CreateBookDialogProps) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [initialStock, setInitialStock] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  function resetForm() {
    setName("");
    setAuthor("");
    setIsbn("");
    setDescription("");
    setInitialStock("0");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createBook({
        name,
        author: author.trim() || undefined,
        isbn: isbn.trim() || undefined,
        description: description.trim() || undefined,
        initialStock: Number(initialStock)
      });
      toast.success("Libro creado correctamente");
      resetForm();
      onClose();
      onSuccess();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "No se pudo crear el libro";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Agregar libro"
      description="Registra un nuevo libro maestro en el inventario."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <Input label="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        <Textarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Saldo inicial"
          type="number"
          min={0}
          value={initialStock}
          onChange={(e) => setInitialStock(e.target.value)}
          required
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear libro
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
