"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { ApiClientError, updateUser } from "@/lib/api";
import type { User, UserRole } from "@/lib/types";

type EditUserDialogProps = {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
};

export function EditUserDialog({ open, onClose, user, onSuccess }: EditUserDialogProps) {
  const [role, setRole] = useState<UserRole>("USER");
  const [enabled, setEnabled] = useState("true");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setEnabled(user.enabled !== false ? "true" : "false");
  }, [user]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUser(user.id, {
        role,
        enabled: enabled === "true"
      });
      toast.success("Usuario actualizado correctamente");
      onClose();
      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "No se pudo actualizar el usuario";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Editar usuario"
      description={user?.email}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Rol"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </Select>
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
