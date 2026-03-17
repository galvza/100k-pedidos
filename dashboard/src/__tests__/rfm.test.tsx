/**
 * Testes dos componentes de gráfico do capítulo RFM — T077.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { RfmSegmento, RfmDistribuicao, RfmClustering } from "@/types";

// ------------------------------------------------------------------ //
// Mocks
// ------------------------------------------------------------------ //

vi.mock("recharts", () => ({
  ResponsiveContainer:  ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart:   ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  LineChart:  ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid="scatter-chart">{children}</div>,
  Bar: () => null,
  Line: () => null,
  Scatter: () => null,
  XAxis: () => null,
  YAxis: () => null,
  ZAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
  ReferenceLine: () => null,
  Label: () => null,
  LabelList: () => null,
}));

vi.mock("@/lib/data", () => ({
  loadChapterData: vi.fn(),
}));

import RfmSegmentChart from "@/components/charts/RfmSegmentChart";
import RfmDistribution from "@/components/charts/RfmDistribution";
import ElbowChart from "@/components/charts/ElbowChart";
import ClusterScatter from "@/components/charts/ClusterScatter";
import { loadChapterData } from "@/lib/data";

// ------------------------------------------------------------------ //
// Fixtures
// ------------------------------------------------------------------ //

const segmentosFixture: RfmSegmento[] = [
  { segmento: "Champions", contagem: 8245,  percentual: 8.55,  recencia_media: 24,  frequencia_media: 3.2, monetario_medio: 612.45, r_score_medio: 5.0, f_score_medio: 5.0, m_score_medio: 5.0 },
  { segmento: "Loyal",     contagem: 14658, percentual: 15.20, recencia_media: 78,  frequencia_media: 2.1, monetario_medio: 285.30, r_score_medio: 4.1, f_score_medio: 4.2, m_score_medio: 3.9 },
  { segmento: "Potential", contagem: 18930, percentual: 19.63, recencia_media: 162, frequencia_media: 1.4, monetario_medio: 198.70, r_score_medio: 3.2, f_score_medio: 2.5, m_score_medio: 3.1 },
  { segmento: "At Risk",   contagem: 21870, percentual: 22.68, recencia_media: 340, frequencia_media: 1.3, monetario_medio: 145.80, r_score_medio: 2.0, f_score_medio: 2.1, m_score_medio: 2.4 },
  { segmento: "Lost",      contagem: 32758, percentual: 33.96, recencia_media: 512, frequencia_media: 1.0, monetario_medio: 92.10,  r_score_medio: 1.0, f_score_medio: 1.2, m_score_medio: 1.5 },
];

const distribuicaoFixture: RfmDistribuicao = {
  recency:   { min: 0, max: 714, media: 252.4, mediana: 238, std: 196.1, q1: 65,  q3: 448,   histograma: [{ faixa: "0–30", contagem: 11800 }, { faixa: "31–90", contagem: 14220 }] },
  frequency: { min: 1, max: 17,  media: 1.07,  mediana: 1,   std: 0.52,  q1: 1,   q3: 1,     histograma: [{ faixa: "1",    contagem: 83284 }, { faixa: "2",     contagem: 4218  }] },
  monetary:  { min: 8.5, max: 13440, media: 154.2, mediana: 113.6, std: 185.4, q1: 63.8, q3: 191.2, histograma: [{ faixa: "< R$50", contagem: 7820 }, { faixa: "R$50–100", contagem: 18340 }] },
};

const clusteringFixture: RfmClustering = {
  k_otimo: 4,
  n_original: 96461,
  n_usado: 89234,
  elbow: [
    { k: 2, inertia: 52340 },
    { k: 3, inertia: 38210 },
    { k: 4, inertia: 29870 },
  ],
  silhouette: [
    { k: 2, silhouette: 0.42 },
    { k: 3, silhouette: 0.38 },
    { k: 4, silhouette: 0.35 },
  ],
  cluster_profiles: [
    { cluster: 0, label: "Cluster A — VIP",      recencia_media: 28,  frequencia_media: 3.4, monetario_medio: 695.20, contagem: 11294 },
    { cluster: 1, label: "Cluster B — Ativos",   recencia_media: 95,  frequencia_media: 1.8, monetario_medio: 218.50, contagem: 21380 },
    { cluster: 2, label: "Cluster C — Dormentes",recencia_media: 355, frequencia_media: 1.2, monetario_medio: 148.30, contagem: 27890 },
    { cluster: 3, label: "Cluster D — Perdidos", recencia_media: 548, frequencia_media: 1.0, monetario_medio: 82.40,  contagem: 28670 },
  ],
};

const mockLoad = vi.mocked(loadChapterData);

// ------------------------------------------------------------------ //
// T077 — RfmSegmentChart
// ------------------------------------------------------------------ //

describe("T077 — RfmSegmentChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T077a: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<RfmSegmentChart />);
    expect(screen.getByTestId("rfm-segment-chart-loading")).toBeInTheDocument();
  });

  it("T077b: renderiza gráfico com segmentos", async () => {
    mockLoad.mockResolvedValue(segmentosFixture);
    render(<RfmSegmentChart />);
    await waitFor(() =>
      expect(screen.getByTestId("rfm-segment-chart")).toBeInTheDocument()
    );
  });

  it("T077c: exibe mensagem para array vazio", async () => {
    mockLoad.mockResolvedValue([]);
    render(<RfmSegmentChart />);
    await waitFor(() =>
      expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    );
  });

  it("T077d: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(segmentosFixture);
    render(<RfmSegmentChart />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("02_rfm_segmentos.json")
    );
  });
});

// ------------------------------------------------------------------ //
// T077 — RfmDistribution
// ------------------------------------------------------------------ //

describe("T077 — RfmDistribution", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T077e: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<RfmDistribution />);
    expect(screen.getByTestId("rfm-distribution-loading")).toBeInTheDocument();
  });

  it("T077f: renderiza 3 histogramas com dados", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<RfmDistribution />);
    await waitFor(() =>
      expect(screen.getByTestId("rfm-distribution")).toBeInTheDocument()
    );
  });

  it("T077g: exibe 3 títulos de dimensão", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<RfmDistribution />);
    await waitFor(() => {
      expect(screen.getByText(/recência/i)).toBeInTheDocument();
      expect(screen.getByText(/frequência/i)).toBeInTheDocument();
      expect(screen.getByText(/valor monetário/i)).toBeInTheDocument();
    });
  });
});

// ------------------------------------------------------------------ //
// T077 — ElbowChart
// ------------------------------------------------------------------ //

describe("T077 — ElbowChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T077h: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<ElbowChart />);
    expect(screen.getByTestId("elbow-chart-loading")).toBeInTheDocument();
  });

  it("T077i: renderiza gráfico após carregar dados", async () => {
    mockLoad.mockResolvedValue(clusteringFixture);
    render(<ElbowChart />);
    await waitFor(() =>
      expect(screen.getByTestId("elbow-chart")).toBeInTheDocument()
    );
  });

  it("T077j: exibe mensagem para clustering sem elbow data", async () => {
    mockLoad.mockResolvedValue({ ...clusteringFixture, elbow: [] });
    render(<ElbowChart />);
    await waitFor(() =>
      expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    );
  });
});

// ------------------------------------------------------------------ //
// T077 — ClusterScatter
// ------------------------------------------------------------------ //

describe("T077 — ClusterScatter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T077k: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<ClusterScatter />);
    expect(screen.getByTestId("cluster-scatter-loading")).toBeInTheDocument();
  });

  it("T077l: renderiza scatter com cluster profiles", async () => {
    mockLoad.mockResolvedValue(clusteringFixture);
    render(<ClusterScatter />);
    await waitFor(() =>
      expect(screen.getByTestId("cluster-scatter")).toBeInTheDocument()
    );
  });

  it("T077m: exibe mensagem quando cluster_profiles é vazio", async () => {
    mockLoad.mockResolvedValue({ ...clusteringFixture, cluster_profiles: [] });
    render(<ClusterScatter />);
    await waitFor(() =>
      expect(screen.getByText(/sem dados de cluster/i)).toBeInTheDocument()
    );
  });

  it("T077n: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(clusteringFixture);
    render(<ClusterScatter />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("02_rfm_clustering.json")
    );
  });
});
