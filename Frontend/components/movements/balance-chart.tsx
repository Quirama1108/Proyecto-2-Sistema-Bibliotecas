"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { BalancePoint } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { LineChart as LineChartIcon } from "lucide-react";

type BalanceChartProps = {
  points: BalancePoint[];
  bookName: string;
};

export function BalanceChart({ points, bookName }: BalanceChartProps) {
  if (points.length === 0) {
    return (
      <EmptyState
        icon={LineChartIcon}
        title="Sin datos para la grafica"
        description="Registra movimientos para ver la evolucion del saldo."
      />
    );
  }

  const data = points.map((point) => ({
    ...point,
    label: formatShortDate(point.date)
  }));

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/90 sm:p-5">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
          Evolucion del saldo
        </h3>
        <p className="truncate text-sm text-stone-500 dark:text-stone-400">{bookName}</p>
      </div>
      <div className="h-56 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" className="dark:opacity-20" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              stroke="#78716c"
              interval="preserveStartEnd"
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#78716c" width={32} />
            <Tooltip
              formatter={(value: number) => [`${value} ejemplares`, "Saldo"]}
              labelFormatter={(label) => `Fecha: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e7e5e4"
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="none"
              fill="url(#balanceGradient)"
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#d97706", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#b45309" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
