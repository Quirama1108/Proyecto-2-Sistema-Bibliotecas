import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display hidden text-2xl font-semibold text-stone-900 dark:text-stone-50 lg:block">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">{action}</div> : null}
    </div>
  );
}
