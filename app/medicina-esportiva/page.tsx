import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { PortraitSection } from "@/components/ui/PortraitSection";
import { MaterialGratuito } from "@/components/ui/MaterialGratuito";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema, serviceSchema } from "@/lib/schema";
import { FaixaFoto } from "@/components/ui/FaixaFoto";

export const metadata: Metadata = {
  title: "Medicina esportiva e performance, Goiânia",
  description:
    "Avaliação clínica de quem treina, em Goiânia: manejo de dor, retorno seguro ao esporte, prevenção de lesões e saúde para performance sustentável.",
  alternates: { canonical: "/medicina-esportiva" },
};

const services = [
  {
    title: "Avaliação pré-participação",
    text: "Liberação clínica para iniciar ou intensificar treinos, com estratificação de risco cardiovascular e metabólico.",
  },
  {
    title: "Manejo clínico da dor",
    text: "Investigação da origem da dor musculoesquelética e plano de manejo integrado — área em que desenvolvo pesquisa científica desde a graduação.",
  },
  {
    title: "Retorno ao esporte",
    text: "Planejamento clínico do retorno após lesões ou afastamentos, em conjunto com fisioterapia e educação física, com critérios objetivos de progressão.",
  },
  {
    title: "Saúde de base para performance",
    text: "Sono, recuperação, exames e condições clínicas que limitam seu rendimento, avaliados e tratados com evidência — sem atalhos hormonais sem indicação.",
  },
];

const forWhom = [
  "Atletas amadores e de fim de semana que querem treinar com segurança",
  "Praticantes de musculação, corrida, crossfit e esportes de resistência",
  "Pessoas em retorno ao exercício após lesão, cirurgia ou longo período parado",
  "Quem convive com dor recorrente relacionada ao treino e precisa de investigação séria",
];

const faq: FaqItem[] = [
  {
    question: "Medicina esportiva é só para atleta profissional?",
    answer:
      "Não. A maior parte dos pacientes é de praticantes recreativos e amadores que querem evoluir sem se machucar. A avaliação médica identifica riscos, organiza exames e integra o trabalho de treinador e fisioterapeuta.",
  },
  {
    question: "Vocês prescrevem hormônios para performance?",
    answer:
      "Não há prescrição de anabolizantes ou hormônios com finalidade estética ou de rendimento sem indicação clínica — prática vedada pelas normas médicas brasileiras. O foco é otimizar saúde, treino, sono e nutrição com segurança e evidência.",
  },
  {
    question: "Como funciona a investigação de dor relacionada ao treino?",
    answer:
      "Começa com consulta detalhada e exame clínico, seguidos de exames de imagem quando indicados. O plano pode envolver ajuste de carga, encaminhamento à fisioterapia, manejo farmacológico e reavaliações programadas até a resolução.",
  },
  {
    question: "Atende por telemedicina?",
    answer:
      "Sim, para avaliações iniciais, interpretação de exames e acompanhamento. Quadros que exigem exame físico detalhado são agendados presencialmente em Goiânia.",
  },
];

export default function MedicinaEsportivaPage() {
  return (
    <>
      <PageHero
        fundo="pulso"
        eyebrow="Medicina Esportiva & Performance"
        title={
          <>
            Treine forte, <span className="text-gradient">com respaldo clínico</span>
          </>
        }
        lede="Saúde de quem se move: avaliação criteriosa, manejo de dor com base científica e planejamento de retorno ao esporte com critérios objetivos."
        scene="wave"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Medicina Esportiva", path: "/medicina-esportiva" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 80}>
              <div className="glass card-hover h-full rounded-3xl p-8">
                {/* h2: é a primeira seção depois do h1, não pode entrar em h3 */}
                <h2 className="font-display text-xl font-semibold tracking-tight">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mt-28 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Para quem"
              title="Do primeiro treino ao alto rendimento"
              lede="A consulta é o ponto de partida para treinar com segurança — e o ponto de apoio quando algo sai do lugar."
            />
            <ul className="space-y-4">
              {forWhom.map((item, i) => (
                <Reveal as="li" key={i} delay={i * 70} className="glass flex items-start gap-4 rounded-2xl p-5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]"
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed text-muted">{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PortraitSection
        eyebrow="Ciência aplicada ao movimento"
        title={
          <>
            Quem investiga dor <span className="text-gradient">de perto</span>
          </>
        }
        lede="Minha produção científica começou justamente em dor e procedimentos guiados por imagem — o mesmo tema que aparece no consultório de quem treina. Isso significa avaliar a origem da queixa com critério, evitar exames desnecessários e definir um retorno ao esporte com marcos objetivos, não com achismo."
        image="/images/dr-casual-camisa.jpg"
        alt="Dr. José Victor em camisa social, sorrindo"
        reverse
      />

      <section className="mx-auto mt-32 max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Perguntas frequentes" title="Antes de agendar" align="center" />
        <div className="mt-12">
          <FaqAccordion items={faq} />
        </div>
      </section>

      {/*
        O material vem depois das perguntas frequentes e antes do convite para
        agendar. Quem chegou até aqui leu a página inteira — é o ponto em que
        oferecer algo de graça soa como continuação, e não como pedágio.
      */}
      <section className="mx-auto mt-24 max-w-4xl px-5 sm:px-8">
        <MaterialGratuito />
      </section>

      <FaixaFoto
        src="/images/dr-poltrona-perfil.jpg"
        alt="Dr. José Victor Lisboa Cardoso Gomes"
        legenda="Voltar a treinar sem repetir a lesão que tirou você do esporte."
        altura="media"
      />

      <CtaSection
        title="Performance começa com saúde"
        message="Olá! Gostaria de agendar uma avaliação de medicina esportiva com o Dr. José Victor."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Medicina Esportiva", path: "/medicina-esportiva" },
          ]),
          medicalWebPageSchema({
            title: "Medicina Esportiva e Performance",
            description: metadata.description as string,
            path: "/medicina-esportiva",
          }),
          serviceSchema({
            name: "Medicina Esportiva e Performance",
            description:
              "Avaliação clínica de quem treina, manejo de dor, prevenção de lesões e retorno seguro ao esporte.",
            path: "/medicina-esportiva",
          }),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
