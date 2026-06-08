"use client";

import {
  ArrowLeftRight,
  BookOpen,
  Library,
  LogOut,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems: Array<{
  href: string;
  label: string;
  icon: typeof ArrowLeftRight;
  roles: UserRole[];
}> = [
  { href: "/transacciones", label: "Transacciones", icon: ArrowLeftRight, roles: ["ADMIN", "USER"] },
  { href: "/maestros", label: "Maestros", icon: BookOpen, roles: ["ADMIN", "USER"] },
  { href: "/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] }
];

type SidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menu"
        className={cn(
          "fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-stone-800 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 shadow-2xl transition-transform duration-300 lg:z-40 lg:max-w-none lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-800/80 px-5 py-4 lg:px-6 lg:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-900/40">
              <Library className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white">Biblioteca</p>
              <p className="text-xs text-stone-400">Sistema de gestion</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            aria-label="Cerrar menu"
            className="text-stone-300 hover:bg-stone-800 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-b border-stone-800/80 px-5 py-4 lg:px-6 lg:py-5">
          <div className="flex items-center gap-3">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-600/50 lg:h-12 lg:w-12"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-semibold text-white ring-2 ring-amber-600/30 lg:h-12 lg:w-12">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-stone-400">{user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-amber-400">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 lg:px-4">
          {navItems
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30"
                      : "text-stone-300 hover:bg-stone-800/80 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="space-y-2 border-t border-stone-800/80 p-3 lg:p-4">
          <ThemeToggle className="w-full justify-start text-stone-300 hover:bg-stone-800 hover:text-white" />
          <button
            type="button"
            onClick={() => {
              onMobileClose();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-stone-800 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}
