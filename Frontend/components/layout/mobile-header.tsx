"use client";

import { Library, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

type MobileHeaderProps = {
  title: string;
  onMenuOpen: () => void;
};

export function MobileHeader({ title, onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-stone-200/80 bg-white/90 px-3 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90 sm:gap-3 sm:px-4 lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuOpen}
        aria-label="Abrir menu"
        className="shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
          <Library className="h-4 w-4" />
        </div>
        <p className="truncate font-display text-sm font-semibold text-stone-900 dark:text-stone-50">
          {title}
        </p>
      </div>
      <ThemeToggle className="shrink-0" />
    </header>
  );
}
