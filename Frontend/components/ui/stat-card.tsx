import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "amber" | "emerald" | "sky" | "rose";
};

const tones = {
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  rose: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
};

export function StatCard({ label, value, icon: Icon, tone = "amber" }: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/90">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-stone-50">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110",
            tones[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
