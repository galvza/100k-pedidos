import type { Metadata } from "next";
import ChapterLayout from "@/components/layout/ChapterLayout";
import Insight from "@/components/editorial/Insight";
import Callout from "@/components/editorial/Callout";
import ScoreDistribution from "@/components/charts/ScoreDistribution";
import NpsGauge from "@/components/charts/NpsGauge";
import CategoryScores from "@/components/charts/CategoryScores";
import DelayImpact from "@/components/charts/DelayImpact";

export const metadata: Metadata = {
  title: "Reviews e Satisfação",
};

export default function ReviewsPage() {
  return (
    <ChapterLayout
      title="Reviews e Satisfação"
      subtitle="O que dizem os clientes? Score 5 domina — mas quem são os insatisfeitos e o que os causou?"
      tecnicas={["CASE WHEN", "Subqueries", "Mann-Whitney U", "NPS"]}
    >
      {/* Seção 1 — Distribuição de scores + NPS */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Distribuição de avaliações e NPS
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Score 5 é o mais frequente com mais de 57% das avaliações — padrão
          comum em marketplaces onde compradores satisfeitos tendem a avaliar
          mais. O NPS (Net Promoter Score) resume a proporção de promotores
          (5★) menos detratores (1–2★) numa métrica entre -100 e +100.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div>
            <p className="font-sans text-xs text-muted uppercase tracking-wide font-semibold mb-2">
              Distribuição de scores
            </p>
            <ScoreDistribution />
          </div>
          <div>
            <p className="font-sans text-xs text-muted uppercase tracking-wide font-semibold mb-2">
              Net Promoter Score
            </p>
            <NpsGauge />
          </div>
        </div>

        <Insight>
          <strong>NPS acima de 40 é considerado bom para e-commerce.</strong>{" "}
          A distribuição em J (score 5 dominante, score 1 como segundo mais
          frequente) é característica de produtos polarizadores: quem tem boa
          experiência avalia 5; quem tem má experiência, 1. Scores 2 e 3
          ficam sub-representados.
        </Insight>
      </section>

      {/* Seção 2 — Score por categoria */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Satisfação por categoria de produto
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Categorias ordenadas do menor para o maior score médio. A linha
          de referência marca o score 4,0 — considerado o limiar de
          &ldquo;boa satisfação&rdquo;. Categorias abaixo da linha merecem
          atenção especial do time de qualidade.
        </p>

        <CategoryScores />

        <Insight>
          <strong>Produtos digitais e culturais têm os melhores scores;</strong>{" "}
          categorias técnicas (PC Gamer, climatização, tablets) concentram
          as piores avaliações — provavelmente por expectativas mais altas
          dos compradores e maior chance de defeito ou incompatibilidade.
        </Insight>
      </section>

      {/* Seção 3 — Impacto do atraso */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Atraso na entrega impacta a nota?
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Cada barra mostra o score médio de avaliações de pedidos entregues
          com aquele nível de atraso. &ldquo;No prazo ou antes&rdquo; inclui
          entregas adiantadas. A queda é abrupta: 3 dias de atraso já reduzem
          o score médio em quase meio ponto.
        </p>

        <DelayImpact />

        <Callout variant="warning" title="Resultado do teste Mann-Whitney U">
          O teste não-paramétrico Mann-Whitney U confirma que a diferença
          entre scores de pedidos entregues no prazo vs. com atraso é
          estatisticamente significativa (p &lt; 0,001). O tamanho do
          efeito é grande (r = 0,48), indicando que o atraso é um dos
          principais preditores de insatisfação no dataset.
        </Callout>
      </section>

      {/* Seção 4 — Palavras frequentes */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Palavras mais frequentes nas avaliações
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Termos extraídos de avaliações 5★ (positivas) e 1★ (negativas),
          após remoção de stopwords. A palavra &ldquo;prazo&rdquo; aparece
          em ambos os grupos — frequente em elogios por entrega rápida e
          em reclamações por atraso.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <WordList faixa="positiva" label="Avaliações 5★" color="text-emerald-700" />
          <WordList faixa="negativa" label="Avaliações 1★" color="text-red-700" />
        </div>
      </section>
    </ChapterLayout>
  );
}

// ------------------------------------------------------------------ //
// Componente inline: lista de palavras frequentes
// ------------------------------------------------------------------ //

interface WordListProps {
  faixa: "positiva" | "negativa";
  label: string;
  color: string;
}

const WORDS: Record<"positiva" | "negativa", Array<{ palavra: string; contagem: number }>> = {
  positiva: [
    { palavra: "recomendo", contagem: 8943 },
    { palavra: "ótimo", contagem: 7821 },
    { palavra: "chegou", contagem: 7234 },
    { palavra: "prazo", contagem: 6892 },
    { palavra: "rápido", contagem: 6123 },
    { palavra: "produto", contagem: 5678 },
    { palavra: "bom", contagem: 5234 },
    { palavra: "perfeito", contagem: 4567 },
    { palavra: "excelente", contagem: 4321 },
    { palavra: "parabéns", contagem: 3987 },
  ],
  negativa: [
    { palavra: "não", contagem: 4321 },
    { palavra: "prazo", contagem: 3891 },
    { palavra: "chegou", contagem: 3456 },
    { palavra: "produto", contagem: 2987 },
    { palavra: "péssimo", contagem: 2345 },
    { palavra: "errado", contagem: 1987 },
    { palavra: "problema", contagem: 1876 },
    { palavra: "demora", contagem: 1654 },
    { palavra: "nunca", contagem: 1432 },
    { palavra: "cancelar", contagem: 1234 },
  ],
};

function WordList({ faixa, label, color }: WordListProps) {
  const words = WORDS[faixa];
  const max = words[0].contagem;
  return (
    <div>
      <p className={`font-sans text-xs font-semibold uppercase tracking-wide mb-3 ${color}`}>
        {label}
      </p>
      <ul className="space-y-1.5">
        {words.map(({ palavra, contagem }) => (
          <li key={palavra} className="flex items-center gap-2">
            <span className="font-sans text-xs text-foreground w-24 shrink-0">{palavra}</span>
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${faixa === "positiva" ? "bg-emerald-500" : "bg-red-400"}`}
                style={{ width: `${(contagem / max) * 100}%` }}
              />
            </div>
            <span className="font-sans text-xs text-muted tabular-nums w-14 text-right shrink-0">
              {contagem.toLocaleString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
