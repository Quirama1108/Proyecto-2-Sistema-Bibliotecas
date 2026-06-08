"use client";

import { Pencil, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { PageHeader } from "@/components/layout/page-header";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MobileCard, MobileCardField, MobileCardList } from "@/components/ui/mobile-card";
import { Panel } from "@/components/ui/panel";
import { ListControls } from "@/components/ui/list-controls";
import { Pagination } from "@/components/ui/pagination";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ApiClientError, getUsers } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, SORT_LABELS } from "@/lib/constants";
import type { Pagination as PaginationMeta, User } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function UsuariosPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getUsers({ page, pageSize });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "No se pudieron cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-6">
        <PageHeader
          title="Usuarios"
          description="Administra roles y estado de las cuentas del sistema."
        />

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <Panel>
          <div className="border-b border-stone-200 p-4 dark:border-stone-800 sm:px-5 sm:pt-5">
            <ListControls
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              sortLabel={SORT_LABELS.users}
              total={pagination?.total}
              searchHint="La API no incluye búsqueda de usuarios. Los resultados se ordenan por fecha de creación."
            />
          </div>
          {isLoading ? (
            <TableSkeleton />
          ) : users.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={Users} title="No hay usuarios registrados" />
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              <MobileCardList>
                {users.map((user) => (
                  <MobileCard key={user.id}>
                    <p className="mb-1 font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="mb-3 truncate text-sm text-stone-500 dark:text-stone-400">
                      {user.email}
                    </p>
                    <MobileCardField
                      label="Rol"
                      value={
                        <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                          {user.role}
                        </Badge>
                      }
                    />
                    <MobileCardField
                      label="Estado"
                      value={
                        <Badge variant={user.enabled ? "success" : "danger"}>
                          {user.enabled ? "Activo" : "Inactivo"}
                        </Badge>
                      }
                    />
                    <MobileCardField
                      label="Creado"
                      value={user.createdAt ? formatDate(user.createdAt) : "—"}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar usuario
                    </Button>
                  </MobileCard>
                ))}
              </MobileCardList>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                      <th className="px-3 py-3 font-medium">ID</th>
                      <th className="px-3 py-3 font-medium">Fecha de creación</th>
                      <th className="px-3 py-3 font-medium">Correo</th>
                      <th className="px-3 py-3 font-medium">Nombre</th>
                      <th className="px-3 py-3 font-medium">Rol</th>
                      <th className="px-3 py-3 font-medium">Estado</th>
                      <th className="px-3 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-stone-100 transition hover:bg-stone-50/80 dark:border-stone-800 dark:hover:bg-stone-800/40"
                      >
                        <td className="px-3 py-3 font-mono text-xs text-stone-600 dark:text-stone-400">
                          {user.id.slice(0, 8)}...
                        </td>
                        <td className="px-3 py-3 text-stone-700 dark:text-stone-300">
                          {user.createdAt ? formatDate(user.createdAt) : "—"}
                        </td>
                        <td className="px-3 py-3 text-stone-700 dark:text-stone-300">{user.email}</td>
                        <td className="px-3 py-3 font-medium text-stone-900 dark:text-stone-100">
                          {user.name}
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant={user.role === "ADMIN" ? "info" : "default"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant={user.enabled ? "success" : "danger"}>
                            {user.enabled ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar usuario
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination ? <Pagination pagination={pagination} onPageChange={setPage} /> : null}
            </div>
          )}
        </Panel>

        <EditUserDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSuccess={async () => {
            await loadUsers();
            if (selectedUser?.id === currentUser?.id) {
              await refreshUser();
            }
          }}
        />
      </div>
    </AuthGuard>
  );
}
