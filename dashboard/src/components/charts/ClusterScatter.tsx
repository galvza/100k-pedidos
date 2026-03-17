"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { loadChapterData } from "@/lib/data";
import type { RfmClustering, RfmClusterProfile } from "@/types";
import { formatBRL, formatNumber } from "@/lib/formatters";
import { CHART_COLORS, CHART_CONFIG, MUTED_COLOR } from "@/lib/constants";

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ payload: RfmClusterProfile & { x: number; y: number; z: number } }>;
}

const CustomTooltip = ({ active, payload }: TooltipPayload) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded px-3 py-2 text-xs font-sans shadow-sm">
      <p className="font-semibold text-primary mb-1">{d.label}</p>
      <p className="text-foreground">
        Recência: <span className="font-medium">{d.recencia_media} dias</span>
      </p>
      <p className="text-foreground">
        Gasto médio: <span className="font-medium">{formatBRL(d.monetario_medio)}</span>
      </p>
      <p className="text-foreground">
        Clientes: <span className="font-medium">{formatNumber(d.contagem)}</span>
      </p>
    </div>
  );
};

/**
 * Scatter plot (bolhas) dos clusters K-Means.
 * X: recência média | Y: valor médio | Tamanho: número de clientes.
 */
export default function ClusterScatter() {
  const [data, setData] = useState<RfmClustering | null>(null);

  useEffect(() => {
    loadChapterData<RfmClustering>("02_rfm_clustering.json").then(setData);
  }, []);

  if (data === null) {
    return (
      <div
        data-testid="cluster-scatter-loading"
        className="h-64 bg-secondary animate-pulse rounded mt-4"
      />
    );
  }

  const profiles = data.cluster_profiles;
  if (!profiles?.length) {
    return <p className="text-muted text-sm mt-4">Sem dados de cluster disponíveis.</p>;
  }

  // Normaliza contagem para o range de tamanho das bolhas
  const maxCount = Math.max(...profiles.map((p) => p.contagem));
  const scatterData = profiles.map((p) => ({
    ...p,
    x: p.recencia_media,
    y: p.monetario_medio,
    z: (p.contagem / maxCount) * 100,
  }));

  return (
    <div data-testid="cluster-scatter" className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 24, bottom: 24, left: 24 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Recência"
            label={{
              value: "Recência (dias)",
              position: "insideBottom",
              offset: -10,
              fontSize: 10,
              fill: MUTED_COLOR,
            }}
            tick={{ fontSize: CHART_CONFIG.fontSizeAxis, fill: MUTED_COLOR }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Gasto"
            tickFormatter={(v: number) => `R$${v}`}
            tick={{ fontSize: CHART_CONFIG.fontSizeAxis, fill: MUTED_COLOR }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <ZAxis type="number" dataKey="z" range={[200, 1200]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
          {scatterData.map((point, i) => (
            <Scatter
              key={point.cluster}
              name={point.label}
              data={[point]}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
