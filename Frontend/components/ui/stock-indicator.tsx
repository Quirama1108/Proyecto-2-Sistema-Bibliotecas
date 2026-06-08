import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isLowStock } from "@/lib/stock";

export function StockIndicator({ stock }: { stock: number }) {
  if (!isLowStock(stock)) {
    return <span className="font-medium text-stone-900 dark:text-stone-100">{stock}</span>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-medium text-rose-700 dark:text-rose-300">{stock}</span>
      <Badge variant="danger">
        <span className="inline-flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Bajo
        </span>
      </Badge>
    </span>
  );
}
