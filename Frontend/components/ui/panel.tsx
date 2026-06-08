import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Panel({ children, className, hover = false }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/90",
        hover && "transition duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
