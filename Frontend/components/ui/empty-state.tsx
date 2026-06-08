import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, action, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-6 py-8 text-center dark:border-stone-700 dark:bg-stone-900/50">
      {Icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <p className="font-display text-lg font-semibold text-stone-800 dark:text-stone-100">
        {title}
      </p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
