import type { ReactNode } from "react";

export function MobileCardList({ children }: { children: ReactNode }) {
  return <div className="space-y-3 md:hidden">{children}</div>;
}

export function MobileCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/90 p-4 shadow-sm transition duration-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/80">
      {children}
    </div>
  );
}

export function MobileCardField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-200 py-2 last:border-0 last:pb-0 first:pt-0 dark:border-stone-800">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </span>
      <span className="text-right text-sm text-stone-800 dark:text-stone-200">{value}</span>
    </div>
  );
}
