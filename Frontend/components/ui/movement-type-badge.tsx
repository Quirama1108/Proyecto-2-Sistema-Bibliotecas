import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MovementType } from "@/lib/types";

export function MovementTypeBadge({ type }: { type: MovementType }) {
  const isEntrada = type === "ENTRADA";
  return (
    <Badge variant={isEntrada ? "success" : "warning"}>
      <span className="inline-flex items-center gap-1">
        {isEntrada ? (
          <ArrowDownLeft className="h-3 w-3" />
        ) : (
          <ArrowUpRight className="h-3 w-3" />
        )}
        {type}
      </span>
    </Badge>
  );
}
