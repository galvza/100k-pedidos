import type { Metadata } from "next";
import ChapterLayout from "@/components/layout/ChapterLayout";
import Insight from "@/components/editorial/Insight";
import Callout from "@/components/editorial/Callout";
import RfmSegmentChart from "@/components/charts/RfmSegmentChart";
import RfmDistribution from "@/components/charts/RfmDistribution";
import ElbowChart from "@/components/charts/ElbowChart";
import ClusterScatter from "@/components/charts/ClusterScatter";

export const metadata: Metadata = {
  title: "Segmentação RFM",
};

export default function RfmPage() {
  return (
    <ChapterLayout
      title="Segmentação RFM"
      subtitle="Quem são os clientes mais valiosos — e quais estão prestes a desaparecer?"
      tecnicas={["NTILE", "Window Functions", "K-Means", "StandardScaler", "Silhouette"]}
    >
      {/* Seção 1 — O que é RFM? */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          O que é RFM?
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          RFM é um modelo de segmentação comportamental que classifica clientes
          em três dimensões: <strong>Recência</strong> (há quantos dias fez a
          última compra), <strong>Frequência</strong> (quantas vezes comprou) e
          <strong>Valor Monetário</strong> (quanto gastou no total). Cada
          dimensão recebe uma nota de 1 a 5 via NTILE(5), gerando um score
          combinado que classifica o cliente em um dos segmentos abaixo.
        </p>

        <RfmSegmentChart />

        <Insight>
          <strong>33,9% dos clientes são considerados &ldquo;perdidos&rdquo;</strong> —
          compraram há mais de 480 dias e nunca retornaram. Os Champions (8,5%)
          concentram o maior gasto médio: R$ 612 por cliente, quase 7x mais do
          que os Lost (R$ 92).
        </Insight>
      </section>

      {/* Seção 2 — Distribuição das métricas */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Distribuição das métricas
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Os histogramas revelam o perfil da base de clientes em cada dimensão
          RFM. A distribuição de frequência é o dado mais revelador: a altíssima
          concentração em &ldquo;1 compra&rdquo; não é um problema do modelo — é a realidade
          estrutural de um marketplace.
        </p>

        <RfmDistribution />

        <Insight>
          <strong>93,3% dos clientes compraram apenas uma vez.</strong>{" "}
          Este é o comportamento típico de marketplaces: o cliente encontra um
          produto, compra, e raramente retorna pela plataforma. A análise de
          cohort (capítulo 3) aprofunda essa dinâmica. O valor de Frequência
          médio de 1,07 pedidos confirma que Recência e Valor Monetário são as
          dimensões mais discriminantes para segmentação neste contexto.
        </Insight>
      </section>

      {/* Seção 3 — Segmentação automática */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Segmentação automática — K-Means
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          O K-Means agrupa os clientes sem rótulos pré-definidos, encontrando
          estruturas naturais nos dados. O número ideal de clusters{" "}
          <em>k</em> é determinado pelo Elbow Method: escolhe-se o ponto onde
          a redução de inércia começa a diminuir significativamente — o
          &ldquo;cotovelo&rdquo; da curva.
        </p>

        <ElbowChart />

        <p className="font-sans text-sm text-muted leading-relaxed mt-4 mb-1">
          Com <strong>k = 4</strong>, o modelo encontrou quatro perfis distintos.
          O scatter abaixo posiciona cada cluster pelo par Recência × Valor
          Monetário. O tamanho da bolha é proporcional ao número de clientes.
        </p>

        <ClusterScatter />

        <Insight>
          O Cluster A (VIP) concentra clientes com recência muito baixa e gasto
          alto — equivale naturalmente ao segmento &ldquo;Champions&rdquo; da abordagem
          manual. O Cluster D (Perdidos) alinha-se com o segmento &ldquo;Lost&rdquo;:
          alta recência (distantes no tempo) e baixo valor. A segmentação
          automática corrobora a manual, com a vantagem de não exigir
          definição prévia de thresholds.
        </Insight>
      </section>

      {/* Seção 4 — Manual vs Automático */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Manual vs Automático — qual usar?
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed">
          As duas abordagens são complementares. A segmentação manual (NTILE)
          é interpretável e diretamente acionável: cada segmento tem um nome,
          um critério claro e uma estratégia de marketing associada. Já o
          K-Means descobre estruturas sem pressupostos — útil para validar se
          os segmentos manuais fazem sentido nos dados ou para revelar subgrupos
          não óbvios.
        </p>

        <Callout variant="info" title="Convergência dos métodos">
          O Silhouette Score médio de 0,35 para k = 4 indica uma separação
          moderada — esperada dado que 93% dos clientes têm frequência 1,
          colapsando dimensionalidade. Mesmo assim, os 4 clusters do K-Means
          correspondem qualitativamente aos 5 segmentos manuais, validando a
          lógica de segmentação escolhida.
        </Callout>
      </section>
    </ChapterLayout>
  );
}
