/**
 * Testes dos componentes do capítulo Sazonalidade — T080.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type {
  SazonalidadeMensal,
  SazonalidadeSemanal,
  SazonalidadeHoraria,
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
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
  ReferenceLine: () => null,
}));

import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import WeekdayChart from "@/components/charts/WeekdayChart";
import HourlyChart from "@/components/charts/HourlyChart";
import { loadChapterData } from "@/lib/data";

// ------------------------------------------------------------------ //
// Fixtures
// ------------------------------------------------------------------ //

const mensalFixture: SazonalidadeMensal[] = [
  { mes: "2017-01", pedidos: 800, receita: 109600, media_movel_3m: null, mom_growth: null },
  { mes: "2017-02", pedidos: 1800, receita: 246600, media_movel_3m: null, mom_growth: 1.248 },
  { mes: "2017-03", pedidos: 2682, receita: 367374, media_movel_3m: 241191, mom_growth: 0.49 },
  { mes: "2017-11", pedidos: 7544, receita: 1033528, media_movel_3m: 751628, mom_growth: 0.629 },
];

const semanalFixture: SazonalidadeSemanal[] = [
  { dia_semana: 1, pedidos_medio: 428.5, receita_media: 58705, ticket_medio: 137.0 },
  { dia_semana: 2, pedidos_medio: 427.2, receita_media: 58527, ticket_medio: 137.0 },
  { dia_semana: 7, pedidos_medio: 227.9, receita_media: 34222, ticket_medio: 150.2 },
];

const horariaFixture: SazonalidadeHoraria[] = [
  { hora: 0, pedidos: 234, receita: 32058 },
  { hora: 10, pedidos: 512, receita: 70144 },
  { hora: 20, pedidos: 534, receita: 73158 },
];

const mockLoad = vi.mocked(loadChapterData);

// ------------------------------------------------------------------ //
// T080 — TimeSeriesChart
// ------------------------------------------------------------------ //

describe("T080 — TimeSeriesChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T080a: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<TimeSeriesChart />);
    expect(screen.getByTestId("time-series-loading")).toBeInTheDocument();
  });

  it("T080b: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(mensalFixture);
    render(<TimeSeriesChart />);
    await waitFor(() =>
      expect(screen.getByTestId("time-series-chart")).toBeInTheDocument()
    );
  });

  it("T080c: exibe mensagem para dados vazios", async () => {
    mockLoad.mockResolvedValue([]);
    render(<TimeSeriesChart />);
    await waitFor(() =>
      expect(screen.getByText(/sem dados/i)).toBeInTheDocument()
    );
  });

  it("T080d: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(mensalFixture);
    render(<TimeSeriesChart />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("05_sazonalidade_mensal.json")
    );
  });
});

// ------------------------------------------------------------------ //
// T080 — WeekdayChart
// ------------------------------------------------------------------ //

describe("T080 — WeekdayChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T080e: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<WeekdayChart />);
    expect(screen.getByTestId("weekday-chart-loading")).toBeInTheDocument();
  });

  it("T080f: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(semanalFixture);
    render(<WeekdayChart />);
    await waitFor(() =>
      expect(screen.getByTestId("weekday-chart")).toBeInTheDocument()
    );
  });

  it("T080g: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(semanalFixture);
    render(<WeekdayChart />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("05_sazonalidade_semanal.json")
    );
  });
});

// ------------------------------------------------------------------ //
// T080 — HourlyChart
// ------------------------------------------------------------------ //

describe("T080 — HourlyChart", () => {
  beforeEach(() => vi.clearAllMocks());

  it("T080h: exibe skeleton enquanto carrega", () => {
    mockLoad.mockImplementation(() => new Promise(() => {}));
    render(<HourlyChart />);
    expect(screen.getByTestId("hourly-chart-loading")).toBeInTheDocument();
  });

  it("T080i: renderiza chart após carregar dados", async () => {
    mockLoad.mockResolvedValue(horariaFixture);
    render(<HourlyChart />);
    await waitFor(() =>
      expect(screen.getByTestId("hourly-chart")).toBeInTheDocument()
    );
  });

  it("T080j: chama loadChapterData com arquivo correto", async () => {
    mockLoad.mockResolvedValue(horariaFixture);
    render(<HourlyChart />);
    await waitFor(() =>
      expect(mockLoad).toHaveBeenCalledWith("05_sazonalidade_horaria.json")
    );
  });
});
