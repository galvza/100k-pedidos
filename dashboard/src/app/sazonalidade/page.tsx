import type { Metadata } from "next";
import ChapterLayout from "@/components/layout/ChapterLayout";
import Insight from "@/components/editorial/Insight";
import Callout from "@/components/editorial/Callout";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import WeekdayChart from "@/components/charts/WeekdayChart";
import HourlyChart from "@/components/charts/HourlyChart";

export const metadata: Metadata = {
  title: "Sazonalidade",
};

export default function SazonalidadePage() {
  return (
    <ChapterLayout
      title="Sazonalidade"
      subtitle="Quando os brasileiros compram? Tendência, dia da semana e hora do dia revelam padrões de consumo recorrentes."
      tecnicas={["DATE_TRUNC", "EXTRACT", "Window Functions", "LAG", "Média Móvel"]}
    >
      {/* Seção 1 — Série temporal mensal */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Tendência de receita mensal
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          O dataset cobre 20 meses (jan/2017–ago/2018). A linha tracejada é
          a média móvel de 3 meses — suaviza ruídos pontuais e torna a
          tendência de crescimento mais legível. Novembro de 2017 destoa
          claramente: pico de Black Friday com receita ~67% acima do mês anterior.
        </p>

        <TimeSeriesChart />

        <Insight>
          <strong>Crescimento sustentado, com sazonalidade Black Friday.</strong>{" "}
          A receita sai de R$ 110k em jan/2017 para ~R$ 890k em ago/2018 —
          crescimento de 8× em 20 meses. A média móvel mostra que o pico de
          novembro/2017 não foi permanente: o período pós-BF teve queda, mas
          a tendência de longo prazo retomou o crescimento em 2018.
        </Insight>
      </section>

      {/* Seção 2 — Padrão semanal */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Pedidos por dia da semana
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Cada barra mostra a média diária de pedidos para aquele dia da semana
          ao longo de todo o período. O padrão reflete o comportamento de compra
          dos consumidores: mais ativos no início da semana, queda progressiva
          até o fim de semana.
        </p>

        <WeekdayChart />

        <Insight>
          <strong>Segunda e terça-feira dominam.</strong> Segunda-feira tem ~88%
          mais pedidos que domingo — o consumidor compra no início da semana,
          talvez após browsing no fim de semana. O sábado e domingo concentram
          menos de 20% do volume semanal.
        </Insight>
      </section>

      {/* Seção 3 — Padrão horário */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-2">
          Pedidos por hora do dia
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mb-1">
          Distribuição dos pedidos ao longo das 24 horas do dia. Revela dois
          picos distintos: o matutino (hora do trabalho) e o noturno (após o
          jantar). O mínimo absoluto ocorre entre 3h e 5h da madrugada.
        </p>

        <HourlyChart />

        <Insight>
          <strong>Dois picos: 10h e 20h.</strong> O horário de pico noturno
          (20–21h) supera ligeiramente o matutino (10h), sugerindo que parte
          dos consumidores navega após o trabalho. Campanhas de e-mail
          marketing ou push notification têm maior probabilidade de conversão
          nessas janelas.
        </Insight>

        <Callout variant="note" title="Fuso horário">
          Todos os horários estão em UTC-3 (horário de Brasília). O dataset
          não discrimina fusos dos estados do Norte (AM, AC, RR — UTC-4 e
          UTC-5), então os horários para esses estados podem ter um desvio
          de 1–2 horas.
        </Callout>
      </section>
    </ChapterLayout>
  );
}
