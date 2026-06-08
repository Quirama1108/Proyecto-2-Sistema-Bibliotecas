import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

const variants = {
  default: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300"
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
