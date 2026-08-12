import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { PortraitSection } from "@/components/ui/PortraitSection";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema } from "@/lib/schema";
import { FaixaFoto } from "@/components/ui/FaixaFoto";

export const metadata: Metadata = {
  title: "Telemedicina para todo o Brasil",
  description:
    "Teleconsulta por vídeo: agendamento pelo WhatsApp, privacidade e prescrição digital válida em todo o território nacional. Como funciona, passo a passo.",
  alternates: { canonical: "/telemedicina" },
};

const steps = [
  {
    n: "01",
    title: "Agende pelo WhatsApp",
    text: "Você fala com o consultório, escolhe data e horário e recebe as orientações de preparo — tudo em poucos minutos.",
  },
  {
    n: "02",
    title: "Receba o link seguro",
    text: "Antes da consulta, você recebe o link da videochamada. Basta um celular ou computador com câmera e internet estável.",
  },
  {
    n: "03",
    title: "Consulta por vídeo",
    text: "Mesma profundidade da consulta presencial: anamnese completa, análise de exames e plano de conduta explicado com clareza.",
  },
  {
    n: "04",
    title: "Documentos digitais",
    text: "Prescrições, solicitações de exames e atestados são emitidos com assinatura digital certificada, válida em farmácias e laboratórios de todo o Brasil.",
  },
];

const benefits = [
  "Atendimento de qualquer cidade do Brasil, sem deslocamento",
  "Continuidade do acompanhamento em viagens ou mudanças",
  "Prescrição digital aceita em todo o território nacional",
  "Privacidade e sigilo médico garantidos, conforme LGPD e Código de Ética Médica",
];

const faq: FaqItem[] = [
  {
    question: "Teleconsulta é permitida e regulamentada?",
    answer:
      "Sim. A telemedicina é regulamentada no Brasil pelo Conselho Federal de Medicina, com validade em todo o território nacional. A teleconsulta segue os mesmos deveres éticos da consulta presencial, incluindo sigilo e registro em prontuário.",
  },
  {
    question: "A prescrição online funciona na farmácia?",
    answer:
      "Sim. As prescrições são emitidas com assinatura digital certificada (padrão ICP-Brasil) e podem ser validadas eletronicamente por qualquer farmácia do país. O mesmo vale para solicitações de exames e atestados.",
  },
  {
    question: "E se o meu caso precisar de avaliação presencial?",
    answer:
      "A honestidade clínica vem primeiro: se durante a teleconsulta ficar claro que o seu caso exige exame físico, você será orientado a agendar atendimento presencial em Goiânia ou com um serviço de referência na sua cidade.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "As condições de pagamento são informadas no agendamento pelo WhatsApp, antes da confirmação da consulta, com total transparência.",
  },
];

export default function TelemedicinaPage() {
  return (
    <>
      <PageHero
        fundo="varredura"
        semente="/telemedicina"
        eyebrow="Telemedicina"
        title={
          <>
            O consultório <span className="text-gradient">onde você estiver</span>
          </>
        }
        lede="Consulta por vídeo com a mesma profundidade do atendimento presencial: tempo de escuta, análise criteriosa e documentos digitais válidos em todo o Brasil."
        scene="particles"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Telemedicina", path: "/telemedicina" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Passo a passo" title="Como funciona a teleconsulta" />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 80}>
              <div className="glass card-hover h-full rounded-3xl p-7">
                <span className="font-display text-sm font-semibold text-[var(--accent)]">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="relative mt-28 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Por que telemedicina"
              title="Distância não precisa ser barreira para um bom acompanhamento"
            />
            <ul className="space-y-4">
              {benefits.map((item, i) => (
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
        eyebrow="A mesma consulta, sem a distância"
        title={
          <>
            Atenção integral <span className="text-gradient">pela tela</span>
          </>
        }
        lede="A teleconsulta não é uma versão reduzida do atendimento: é a mesma anamnese detalhada, a mesma análise de exames e o mesmo tempo dedicado a explicar o raciocínio clínico. Muda apenas o meio — e, quando o seu caso exigir exame físico, você será orientado a fazê-lo presencialmente."
        image="/images/dr-terno-punho.jpg"
        alt="Dr. José Victor em traje social, sorrindo, ajustando o punho da camisa"
      />

      <section className="mx-auto mt-32 max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Perguntas frequentes" title="Dúvidas comuns" align="center" />
        <div className="mt-12">
          <FaqAccordion items={faq} />
        </div>
      </section>

      <FaixaFoto
        src="/images/dr-jose-victor-terno.jpg"
        alt="Dr. José Victor Lisboa Cardoso Gomes"
        legenda="A mesma consulta, sem a viagem até o consultório."
        altura="media"
      />

      <CtaSection
        title="Agende sua teleconsulta"
        lede="Atendimento por vídeo para todo o Brasil, com agendamento direto pelo WhatsApp."
        message="Olá! Gostaria de agendar uma teleconsulta com o Dr. José Victor."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Telemedicina", path: "/telemedicina" },
          ]),
          medicalWebPageSchema({
            title: "Telemedicina",
            description: metadata.description as string,
            path: "/telemedicina",
          }),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
