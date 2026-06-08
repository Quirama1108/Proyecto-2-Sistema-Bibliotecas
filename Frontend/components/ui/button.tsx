import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const variants = {
  primary:
    "bg-amber-700 text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] disabled:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500",
  secondary:
    "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800",
  ghost:
    "text-stone-600 hover:bg-stone-100 active:scale-[0.98] dark:text-stone-300 dark:hover:bg-stone-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] dark:bg-red-700 dark:hover:bg-red-600"
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base"
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
