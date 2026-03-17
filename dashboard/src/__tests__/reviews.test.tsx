/**
 * Testes dos componentes do capítulo Reviews e Satisfação — T081.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type {
  ReviewsDistribuicao,
  ReviewsCategorias,
  ReviewsAtraso,
} from "@/types";

// ------------------------------------------------------------------ //
// Mocks
// ------------------------------------------------------------------ //

vi.mock("@/lib/data", () => ({
  loadChapterData: vi.fn(),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
  ReferenceLine: () => null,
  Label: () => null,
}));

import ScoreDistribution from "@/components/charts/ScoreDistribution";
import NpsGauge from "@/components/charts/NpsGauge";
import CategoryScores from "@/components/charts/CategoryScores";
import DelayImpact from "@/components/charts/DelayImpact";
import { loadChapterData } from "@/lib/data";

// ------------------------------------------------------------------ //
// Fixtures
// ------------------------------------------------------------------ //

const distribuicaoFixture: ReviewsDistribuicao[] = [
  { score: 1, contagem: 700, percentual: 0.07 },
  { score: 2, contagem: 500, percentual: 0.05 },
  { score: 3, contagem: 800, percentual: 0.08 },
  { score: 4, contagem: 2000, percentual: 0.20 },
  { score: 5, contagem: 6000, percentual: 0.60 },
];
// NPS = (0.60 - 0.07 - 0.05) * 100 = 48

const categoriasFixture: ReviewsCategorias[] = [
  {
    categoria: "livros_tecnicos",
    total_reviews: 234,
    score_medio: 4.53,
    reviews_positivas: 198,
    reviews_negativas: 8,
  },
  {
    categoria: "seguranca_e_servicos",
    total_reviews: 87,
    score_medio: 2.50,
    reviews_positivas: 23,
    reviews_negativas: 41,
  },
];

const atrasoFixture: ReviewsAtraso[] = [
  { faixa_atraso: "No prazo ou antes", contagem: 83456, score_medio: 4.35, min_dias: -30, max_dias: 0 },
  { faixa_atraso: "1-3 dias", contagem: 6234, score_medio: 3.89, min_dias: 1, max_dias: 3 },
  { faixa_atraso: "Mais de 30 dias", contagem: 678, score_medio: 1.35, min_dias: 31, max_dias: 99 },
];

const mockLoad = vi.mocked(loadChapterData);

// ------------------------------------------------------------------ //
// T081 — ScoreDistribution
// ------------------------------------------------------------------ //

describe("T081 — ScoreDistribution", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T081a: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<ScoreDistribution />);
    expect(
      screen.getByTestId("score-distribution-loading")
    ).toBeInTheDocument();
  });

  it("T081b: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<ScoreDistribution />);
    await waitFor(() =>
      expect(screen.getByTestId("score-distribution")).toBeInTheDocument()
    );
  });

  it("T081c: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<ScoreDistribution />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("06_reviews_distribuicao.json")
    );
  });
});

// ------------------------------------------------------------------ //
// T081 — NpsGauge
// ------------------------------------------------------------------ //

describe("T081 — NpsGauge", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T081d: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<NpsGauge />);
    expect(screen.getByTestId("nps-gauge-loading")).toBeInTheDocument();
  });

  it("T081e: renderiza gauge após carregar dados", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<NpsGauge />);
    await waitFor(() =>
      expect(screen.getByTestId("nps-gauge")).toBeInTheDocument()
    );
  });

  it("T081f: exibe NPS calculado corretamente (48)", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<NpsGauge />);
    await waitFor(() =>
      expect(screen.getByTestId("nps-value")).toHaveTextContent("48")
    );
  });

  it("T081g: exibe label de classificação", async () => {
    mockLoad.mockResolvedValue(distribuicaoFixture);
    render(<NpsGauge />);
    await waitFor(() => {
      // NPS 48 → "Bom" (25 < 48 <= 50)
      expect(screen.getAllByText("Bom").length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ------------------------------------------------------------------ //
// T081 — CategoryScores
// ------------------------------------------------------------------ //

describe("T081 — CategoryScores", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T081h: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<CategoryScores />);
    expect(
      screen.getByTestId("category-scores-loading")
    ).toBeInTheDocument();
  });

  it("T081i: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(categoriasFixture);
    render(<CategoryScores />);
    await waitFor(() =>
      expect(screen.getByTestId("category-scores")).toBeInTheDocument()
    );
  });

  it("T081j: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(categoriasFixture);
    render(<CategoryScores />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("06_reviews_categorias.json")
    );
  });
});

// ------------------------------------------------------------------ //
// T081 — DelayImpact
// ------------------------------------------------------------------ //

describe("T081 — DelayImpact", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T081k: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<DelayImpact />);
    expect(screen.getByTestId("delay-impact-loading")).toBeInTheDocument();
  });

  it("T081l: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(atrasoFixture);
    render(<DelayImpact />);
    await waitFor(() =>
      expect(screen.getByTestId("delay-impact")).toBeInTheDocument()
    );
  });

  it("T081m: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(atrasoFixture);
    render(<DelayImpact />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("06_reviews_atraso.json")
    );
  });
});
