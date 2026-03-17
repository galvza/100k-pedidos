"use client";

import { useEffect, useState } from "react";
import { loadChapterData } from "@/lib/data";
import type { GeoEstado } from "@/types";
import { formatNumber, formatBRL, formatBRLCompact, formatPercent } from "@/lib/formatters";

type SortKey = "pedidos" | "receita" | "frete_medio" | "review_score_medio";

const SORT_LABELS: Record<SortKey, string> = {
  pedidos: "Pedidos",
  receita: "Receita",
  frete_medio: "Frete Médio",
  review_score_medio: "Satisfação",
};

/**
 * Tabela de ranking dos estados ordenável por pedidos, receita, frete ou score.
 */
export default function StateRanking() {
  const [data, setData] = useState<GeoEstado[] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("pedidos");

  useEffect(() => {
    loadChapterData<GeoEstado[]>("04_geo_estados.json").then(setData);
  }, []);

  if (data === null) {
    return (
      <div
        data-testid="state-ranking-loading"
        className="h-64 bg-secondary animate-pulse rounded mt-4"
      />
    );
  }

  const sorted = [...data].sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div data-testid="state-ranking" className="mt-4">
      <div className="flex gap-2 mb-3 flex-wrap">
        {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setSortKey(k)}
            className={`text-xs px-3 py-1.5 rounded border font-sans transition-colors ${
              sortKey === k
                ? "bg-primary text-white border-primary"
                : "bg-white text-muted border-border hover:border-primary"
            }`}
          >
            {SORT_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted font-semibold">#</th>
              <th className="text-left py-2 px-3 text-muted font-semibold">UF</th>
              <th className="text-right py-2 px-3 text-muted font-semibold">Pedidos</th>
              <th className="text-right py-2 px-3 text-muted font-semibold">Receita</th>
              <th className="text-right py-2 px-3 text-muted font-semibold">Frete Médio</th>
              <th className="text-right py-2 px-3 text-muted font-semibold">Frete %</th>
              <th className="text-right py-2 px-3 text-muted font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.estado} className="border-b border-border hover:bg-surface">
                <td className="py-2 px-3 text-muted tabular-nums">{i + 1}</td>
                <td className="py-2 px-3 font-medium text-foreground">{row.estado}</td>
                <td className="py-2 px-3 text-right tabular-nums">{formatNumber(row.pedidos)}</td>
                <td className="py-2 px-3 text-right tabular-nums">{formatBRLCompact(row.receita)}</td>
                <td className="py-2 px-3 text-right tabular-nums">{formatBRL(row.frete_medio)}</td>
                <td className="py-2 px-3 text-right tabular-nums">{formatPercent(row.frete_percentual)}</td>
                <td className="py-2 px-3 text-right tabular-nums">{row.review_score_medio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
