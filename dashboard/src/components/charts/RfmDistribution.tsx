"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { loadChapterData } from "@/lib/data";
import type { RfmDistribuicao, RfmHistogramBin } from "@/types";
import { formatNumber } from "@/lib/formatters";
import { CHART_COLORS, CHART_CONFIG, MUTED_COLOR } from "@/lib/constants";

interface PanelProps {
  title: string;
  bins: RfmHistogramBin[];
  color: string;
}

const HistogramPanel = ({ title, bins, color }: PanelProps) => (
  <div>
    <p className="font-sans text-xs font-semibold text-muted uppercase tracking-wide mb-2">
      {title}
    </p>
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis
            dataKey="faixa"
            tick={{ fontSize: 9, fill: MUTED_COLOR }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatNumber(v)}
            tick={{ fontSize: CHART_CONFIG.fontSizeAxis, fill: MUTED_COLOR }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value: number) => [formatNumber(value), "Clientes"]}
            labelStyle={{ fontSize: 11, fontWeight: 600 }}
            contentStyle={{ fontSize: 11, border: "1px solid #D1D5DB", borderRadius: 4 }}
          />
          <Bar dataKey="contagem" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/**
 * Três histogramas lado a lado: Recência (dias), Frequência (pedidos), Valor (BRL).
 */
export default function RfmDistribution() {
  const [data, setData] = useState<RfmDistribuicao | null>(null);

  useEffect(() => {
    loadChapterData<RfmDistribuicao>("02_rfm_distribuicao.json").then(setData);
  }, []);

  if (data === null) {
    return (
      <div
        data-testid="rfm-distribution-loading"
        className="h-48 bg-secondary animate-pulse rounded mt-4"
      />
    );
  }

  const recencyBins  = data.recency.histograma  ?? [];
  const freqBins     = data.frequency.histograma ?? [];
  const monetaryBins = data.monetary.histograma  ?? [];

  if (!recencyBins.length && !freqBins.length && !monetaryBins.length) {
    return <p className="text-muted text-sm mt-4">Sem dados disponíveis.</p>;
  }

  return (
    <div data-testid="rfm-distribution" className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <HistogramPanel title="Recência (dias)"    bins={recencyBins}  color={CHART_COLORS[0]} />
      <HistogramPanel title="Frequência (pedidos)" bins={freqBins}   color={CHART_COLORS[1]} />
      <HistogramPanel title="Valor monetário"    bins={monetaryBins} color={CHART_COLORS[2]} />
    </div>
  );
}
