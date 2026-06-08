export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div className="flex items-center gap-3 text-stone-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
