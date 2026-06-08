"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LoadingState } from "@/components/ui/loading-state";

type AuthGuardProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (requireAdmin && user?.role !== "ADMIN") {
      router.replace("/acceso-denegado");
    }
  }, [isLoading, isAuthenticated, requireAdmin, user, router, pathname]);

  if (isLoading) {
    return <LoadingState label="Verificando sesion..." />;
  }

  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== "ADMIN") return null;

  return <>{children}</>;
}
