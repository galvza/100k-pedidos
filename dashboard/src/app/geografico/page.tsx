import type { Metadata } from "next";
import ChapterLayout from "@/components/layout/ChapterLayout";
import Insight from "@/components/editorial/Insight";
import Callout from "@/components/editorial/Callout";
import BrazilMapWrapper from "@/components/charts/BrazilMapWrapper";
import StateRanking from "@/components/charts/StateRanking";
import CorrelationChart from "@/components/charts/CorrelationChart";

export const metadata: Metadata = {
  title: "Análise Geográfica",
};

export default function GeograficoPage() {
  return (
    <ChapterLayout
      title="Análise Geográfica"
      subtitle="De onde vêm os pedidos? Como o custo do frete molda a satisfação a cada quilômetro do centroide?"
      tecnicas={["JOINs multi-tabela", "Mann-Whitney U", "Spearman", "Subqueries"]}
    >
      {/* Seção 1 — Mapa interativo */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Distribuição geográfica dos pedidos
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          São Paulo concentra mais de 40% dos pedidos e da receita — reflexo
          direto da maior densidade populacional e renda per capita do país.
          Selecione a métrica para alternar a visualização entre volume de
          pedidos, receita total e satisfação média por estado.
        </p>

        <BrazilMapWrapper />

        <Insight>
          <strong>Sudeste domina o volume, Norte e Nordeste pagam mais frete.</strong>{" "}
          SP, RJ e MG respondem por ~67% dos pedidos. Estados do Norte
          (AM, RR, AC, AP) têm frete médio acima de R$ 50 — mais de 3× o
          custo no estado de São Paulo — e consistentemente os menores
          review scores do dataset.
        </Insight>
      </section>

      {/* Seção 2 — Ranking */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Ranking dos estados
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Use os botões para reordenar a tabela por pedidos, receita, frete
          médio ou satisfação. O gradiente de custo de frete entre regiões é
          visível: estados do Sudeste pagam 11–18% do valor em frete; estados
          do Norte pagam 42–60%.
        </p>

        <StateRanking />
      </section>

      {/* Seção 3 — Correlação frete × satisfação */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Frete impacta satisfação?
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Cada ponto no scatter representa um estado. O eixo horizontal
          mostra o frete como percentual do valor do pedido; o eixo vertical,
          o review score médio. A tendência descendente sugere correlação
          negativa — verificada pelo teste de Spearman.
        </p>

        <CorrelationChart />

        <Callout variant="warning" title="Causalidade vs correlação">
          A correlação Spearman mede associação, não causalidade. O frete mais
          alto nos estados do Norte e Nordeste coincide com menor infraestrutura
          logística, menor renda disponível e potencial maior insatisfação com
          atrasos — fatores confundidores que o dataset não permite isolar
          individualmente.
        </Callout>
      </section>
    </ChapterLayout>
  );
}
