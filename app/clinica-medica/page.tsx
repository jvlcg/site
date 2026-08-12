import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { PortraitSection } from "@/components/ui/PortraitSection";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema, serviceSchema } from "@/lib/schema";
import { FaixaFoto } from "@/components/ui/FaixaFoto";

export const metadata: Metadata = {
  title: "Clínica médica e check-up em Goiânia",
  description:
    "Consultas de clínica médica com tempo de escuta real, check-up estratégico e acompanhamento contínuo, em Goiânia e por telemedicina para todo o Brasil.",
  alternates: { canonical: "/clinica-medica" },
};

const services = [
  {
    title: "Consulta clínica aprofundada",
    text: "Investigação completa de sintomas e histórico, com raciocínio diagnóstico explicado e plano de conduta claro.",
  },
  {
    title: "Check-up estratégico",
    text: "Rastreamento individualizado por idade, histórico familiar e estilo de vida — exames com propósito, não em pacote genérico.",
  },
  {
    title: "Acompanhamento longitudinal",
    text: "Um médico de referência que acompanha sua saúde ao longo do tempo, integra especialistas e centraliza as decisões.",
  },
  {
    title: "Gestão de condições crônicas",
    text: "Hipertensão, diabetes, distúrbios metabólicos e outras condições acompanhadas com metas objetivas e revisão periódica.",
  },
  {
    title: "Emagrecimento e saúde metabólica",
    text: "Acompanhamento clínico do emagrecimento com base em avaliação metabólica, hábitos e evidência — sem fórmulas milagrosas nem promessas de resultado.",
  },
  {
    title: "Prevenção baseada em risco",
    text: "Estratégia preventiva construída sobre dados: estratificação de risco cardiovascular, metabólico e oncológico.",
  },
  {
    title: "Segunda opinião médica",
    text: "Análise independente e fundamentada de diagnósticos e propostas terapêuticas, com revisão de exames e literatura.",
  },
];

const dataPillars = [
  { value: "Anamnese", label: "Tempo real de escuta e investigação — a base de todo diagnóstico bem feito" },
  { value: "Dados", label: "Exames e histórico organizados de forma estruturada para decisões rastreáveis" },
  { value: "Evidência", label: "Condutas fundamentadas em diretrizes e literatura científica atual" },
  { value: "Continuidade", label: "Reavaliações programadas e canal direto com o consultório" },
];

const faq: FaqItem[] = [
  {
    question: "O que diferencia essa consulta de uma consulta convencional?",
    answer:
      "Tempo e método. A consulta é estruturada para investigar a fundo: histórico completo, revisão de exames, hábitos, sono, atividade física e medicações. Ao final, você recebe um plano claro, com o raciocínio explicado e os próximos passos definidos.",
  },
  {
    question: "Vocês atendem por convênio?",
    answer:
      "O atendimento é particular. Essa escolha garante tempo adequado de consulta e liberdade técnica para conduzir cada caso com a profundidade necessária. Recibos são fornecidos para reembolso conforme as regras do seu plano de saúde.",
  },
  {
    question: "Como funciona o check-up?",
    answer:
      "Começa com uma consulta de avaliação para mapear riscos individuais. A partir dela, os exames são solicitados de forma direcionada e, na consulta de retorno, os resultados são interpretados em conjunto, com um plano de ação prático.",
  },
  {
    question: "Posso fazer o acompanhamento por telemedicina?",
    answer:
      "Sim. Consultas de rotina, interpretação de exames e acompanhamento de condições estáveis funcionam muito bem por teleconsulta. Situações que exigem exame físico são agendadas presencialmente em Goiânia.",
  },
];

export default function ClinicaMedicaPage() {
  return (
    <>
      <PageHero
        fundo="mare"
        semente="/clinica-medica"
        eyebrow="Clínica Médica & Check-up"
        title={
          <>
            Um médico que enxerga a sua saúde{" "}
            <span className="text-gradient">como um todo</span>
          </>
        }
        lede="Consultas com tempo de escuta real, prevenção guiada por risco individual e acompanhamento contínuo — de adolescentes (a partir de 14 anos) a idosos. A base que organiza todo o resto do seu cuidado."
        scene="wave"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Clínica Médica", path: "/clinica-medica" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Serviços"
          title="O que você encontra no consultório"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 80}>
              <div className="glass card-hover h-full rounded-3xl p-7">
                <h3 className="font-display text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-[0.93rem] leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mt-28 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Método"
            title="Medicina orientada por dados, centrada em você"
            lede="Tecnologia e documentação estruturada não substituem a relação médico-paciente — elas a tornam mais precisa."
            align="center"
          />
          <dl className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dataPillars.map((p, i) => (
              <Reveal key={p.value} delay={i * 80} className="glass rounded-2xl p-6 text-center">
                <dd className="font-display text-xl font-semibold text-[var(--accent)]">
                  {p.value}
                </dd>
                <dt className="mt-2 text-[0.8rem] leading-snug text-muted">{p.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <PortraitSection
        eyebrow="Seu médico de referência"
        title={
          <>
            Alguém que conhece <span className="text-gradient">a sua história</span>
          </>
        }
        lede="Ter um clínico que acompanha você ao longo do tempo muda o cuidado: exames ganham contexto, tendências aparecem antes do problema e as decisões deixam de ser isoladas. É esse acompanhamento contínuo que organiza sua saúde — e integra os demais especialistas quando necessário."
        image="/images/dr-jaleco-classico.jpg"
        alt="Dr. José Victor de jaleco médico, sorrindo"
      />

      <section className="mx-auto mt-32 max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Perguntas frequentes" title="Antes de agendar" align="center" />
        <div className="mt-12">
          <FaqAccordion items={faq} />
        </div>
      </section>

      <FaixaFoto
        src="/images/dr-jaleco-classico-2.jpg"
        alt="Dr. José Victor Lisboa Cardoso Gomes"
        legenda="Um médico de referência, que acompanha ao longo do tempo."
        altura="media"
      />

      <CtaSection
        title="Comece pelo essencial: uma boa consulta"
        message="Olá! Gostaria de agendar uma consulta de clínica médica com o Dr. José Victor."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Clínica Médica", path: "/clinica-medica" },
          ]),
          medicalWebPageSchema({
            title: "Clínica Médica e Check-up",
            description: metadata.description as string,
            path: "/clinica-medica",
          }),
          serviceSchema({
            name: "Clínica Médica e Check-up",
            description:
              "Consultas de clínica médica, check-up estratégico e acompanhamento longitudinal em Goiânia e por telemedicina.",
            path: "/clinica-medica",
          }),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
