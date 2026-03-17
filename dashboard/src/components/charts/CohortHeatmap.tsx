"use client";

import { useEffect, useState, useRef } from "react";
import { loadChapterData } from "@/lib/data";
import type { CohortHeatmap as CohortHeatmapData } from "@/types";
import { formatPercent, formatNumber, formatMonthYear } from "@/lib/formatters";

/** Converte valor de retenção (0–1) numa cor verde-branca.
 *  Escala clipeada em 20%: ≥20% → verde escuro #059669, 0% → branco. */
function getCellColor(val: number | null): string {
  if (val === null) return "#F3F4F6";
  const t = Math.min(val / 0.2, 1.0);
  const r = Math.round(255 - t * 250);
  const g = Math.round(255 - t * 105);
  const b = Math.round(255 - t * 150);
  return `rgb(${r},${g},${b})`;
}

/** Texto branco para fundos escuros (alta retenção), escuro para fundos claros. */
function getCellTextColor(val: number | null): string {
  if (val === null) return "#9CA3AF";
  return val >= 0.15 ? "#FFFFFF" : "#374151";
}

interface TooltipData {
  x: number;
  y: number;
  coorte: string;
  periodo: number;
  retencao: number | null;
  tamanho: number;
}

/**
 * Heatmap de retenção cohort × período implementado como HTML table.
 * Linhas = coortes mensais, colunas = meses desde a primeira compra.
 * Células nulas (períodos futuros) aparecem em cinza.
 */
export default function CohortHeatmap() {
  const [data, setData] = useState<CohortHeatmapData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChapterData<CohortHeatmapData>("03_cohort_heatmap.json").then(setData);
  }, []);

  if (data === null) {
    return (
      <div
        data-testid="cohort-heatmap-loading"
        className="h-64 bg-secondary animate-pulse rounded mt-4"
      />
    );
  }

  if (!data.dados.length) {
    return <p className="text-muted text-sm mt-4">Sem dados disponíveis.</p>;
  }

  const handleCellEnter = (
    e: React.MouseEvent<HTMLTableCellElement>,
    row: CohortHeatmapData["dados"][number],
    periodo: number,
    val: number | null,
  ) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: cellRect.left - containerRect.left + cellRect.width / 2,
      y: cellRect.top - containerRect.top - 4,
      coorte: formatMonthYear(row.coorte),
      periodo,
      retencao: val,
      tamanho: row.tamanho,
    });
  };

  return (
    <div data-testid="cohort-heatmap" className="mt-4" ref={containerRef} style={{ position: "relative" }}>
      {/* Tooltip customizado */}
      {tooltip && (
        <div
          className="absolute z-20 bg-white border border-border rounded px-3 py-2 text-xs font-sans shadow-sm pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-semibold text-primary mb-1">{tooltip.coorte}</p>
          <p className="text-foreground">
            Período: <span className="font-medium">M+{tooltip.periodo}</span>
          </p>
          {tooltip.retencao !== null ? (
            <>
              <p className="text-foreground">
                Retenção: <span className="font-medium">{formatPercent(tooltip.retencao)}</span>
              </p>
              <p className="text-foreground">
                Clientes retidos:{" "}
                <span className="font-medium">
                  {formatNumber(Math.round(tooltip.tamanho * tooltip.retencao))}
                </span>{" "}
                de {formatNumber(tooltip.tamanho)}
              </p>
            </>
          ) : (
            <p className="text-muted">Período não disponível</p>
          )}
        </div>
      )}

      {/* Indicador de scroll horizontal em mobile */}
      <p className="text-xs text-muted italic mb-2 md:hidden">
        Deslize para ver todos os períodos →
      </p>

      {/* Scroll horizontal em mobile */}
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs font-sans w-full min-w-max">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-muted bg-surface sticky left-0 z-10 border-b border-border whitespace-nowrap">
                Coorte
              </th>
              <th className="text-right px-3 py-2 font-semibold text-muted bg-surface border-b border-border whitespace-nowrap">
                Clientes
              </th>
              {data.periodos.map((p) => (
                <th
                  key={p}
                  className="text-center px-2 py-2 font-semibold text-muted bg-surface border-b border-border w-14 whitespace-nowrap"
                >
                  M+{p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.dados.map((row) => (
              <tr key={row.coorte} className="hover:brightness-95">
                <td className="px-3 py-1.5 font-medium text-foreground bg-surface sticky left-0 z-10 border-b border-border whitespace-nowrap">
                  {formatMonthYear(row.coorte)}
                </td>
                <td className="px-3 py-1.5 text-right text-muted bg-surface border-b border-border">
                  {formatNumber(row.tamanho)}
                </td>
                {row.retencao.map((val, i) => (
                  <td
                    key={i}
                    className="border-b border-white text-center px-1 py-1.5 tabular-nums cursor-default"
                    style={{
                      backgroundColor: getCellColor(val),
                      color: getCellTextColor(val),
                    }}
                    onMouseEnter={(e) => handleCellEnter(e, row, data.periodos[i], val)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {val !== null ? formatPercent(val) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda de cores */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted font-sans">
        <span className="shrink-0">Menor retenção</span>
        <div className="flex h-3 rounded overflow-hidden flex-1 max-w-32">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{ backgroundColor: getCellColor((i / 20) * 0.2), flex: 1 }}
            />
          ))}
        </div>
        <span className="shrink-0">Maior retenção</span>
      </div>
    </div>
  );
}
