import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { PortraitSection } from "@/components/ui/PortraitSection";
import { ThreeScene } from "@/components/three/ThreeScene";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Medicina Endocanabinoide em Goiânia e por telemedicina",
  description:
    "Avaliação médica criteriosa do sistema endocanabinoide: indicação individualizada, prescrição dentro das normas da Anvisa e do CFM e acompanhamento contínuo. Dr. José Victor — CRM-GO 38508.",
  alternates: { canonical: "/medicina-endocanabinoide" },
};

const pillars = [
  {
    title: "O que é o sistema endocanabinoide",
    text: "Uma rede de receptores e mensageiros químicos presente em praticamente todo o corpo humano, envolvida na regulação de dor, sono, apetite, humor, imunidade e outras funções. É um dos sistemas de sinalização mais estudados da neurociência atual.",
  },
  {
    title: "O papel da medicina",
    text: "A medicina endocanabinoide estuda como esse sistema se comporta na saúde e na doença, e em quais situações intervenções farmacológicas sobre ele têm respaldo científico — sempre com avaliação individual de indicação, dose, segurança e interações.",
  },
  {
    title: "Prescrição responsável",
    text: "Produtos à base de canabinoides são regulamentados pela Anvisa e sua prescrição segue as resoluções do Conselho Federal de Medicina. Não há fórmula única: cada caso exige análise médica criteriosa e reavaliação constante.",
  },
];

const conditions = [
  {
    title: "Dor crônica",
    text: "Dores persistentes (musculoesqueléticas, neuropáticas) em que a abordagem convencional não trouxe controle adequado — campo em que desenvolvo pesquisa científica.",
  },
  {
    title: "Insônia e distúrbios do sono",
    text: "Avaliação da higiene do sono e das causas do quadro antes de qualquer conduta, com acompanhamento de resposta e segurança.",
  },
  {
    title: "Ansiedade",
    text: "Sempre em avaliação conjunta com a saúde mental global, de forma integrada e nunca como substituto do acompanhamento psiquiátrico/psicológico quando indicado.",
  },
  {
    title: "Manejo em contexto de acompanhamento",
    text: "Sintomas associados a condições neurológicas e outras, conforme evidência e regulamentação, com metas objetivas e reavaliação constante.",
  },
];

const forWhom = [
  "Pessoas com condições crônicas em que abordagens convencionais não trouxeram controle adequado, mediante avaliação de elegibilidade",
  "Pacientes que buscam segunda opinião sobre tratamento com canabinoides já em uso",
  "Quem deseja entender, com honestidade científica, se essa abordagem se aplica ou não ao seu caso",
  "Pacientes em acompanhamento que precisam de ajuste fino de conduta e monitoramento de efeitos",
];

const process = [
  {
    n: "01",
    title: "Avaliação de elegibilidade",
    text: "Consulta completa: histórico, exames, tratamentos anteriores e objetivos. Nem todo caso tem indicação — e você sairá sabendo o porquê, em qualquer cenário.",
  },
  {
    n: "02",
    title: "Plano terapêutico",
    text: "Quando indicado, o plano define produto regularizado, via, dose inicial e metas objetivas de acompanhamento, com orientação completa sobre a documentação exigida pela Anvisa.",
  },
  {
    n: "03",
    title: "Titulação assistida",
    text: "Início com doses baixas e ajuste gradual, com canal de comunicação direto para dúvidas e monitoramento de resposta e efeitos adversos.",
  },
  {
    n: "04",
    title: "Reavaliação periódica",
    text: "Consultas de retorno programadas para medir resultados com critérios objetivos, ajustar ou — quando necessário — interromper a conduta.",
  },
];

const faq: FaqItem[] = [
  {
    question: "Cannabis medicinal é legalizada no Brasil?",
    answer:
      "O uso medicinal de produtos à base de canabinoides é regulamentado no Brasil pela Anvisa, que autoriza a importação e a venda de produtos específicos mediante prescrição médica. O que a legislação não permite é o uso recreativo ou a produção caseira sem autorização. Na consulta, oriento todo o caminho regulatório de forma legal e segura.",
  },
  {
    question: "Para quais situações a medicina endocanabinoide é estudada?",
    answer:
      "A literatura científica investiga o papel de canabinoides em condições como dor crônica, epilepsias refratárias, distúrbios do sono e sintomas associados a doenças neurológicas, entre outras. A existência de estudos não significa indicação automática: cada caso exige avaliação médica individual de benefício, risco e alternativas.",
  },
  {
    question: "O tratamento causa dependência ou efeitos psicoativos?",
    answer:
      "Depende da composição, da dose e do perfil do paciente. Produtos ricos em CBD não têm efeito psicoativo relevante; formulações com THC exigem critério e monitoramento mais próximos. Essa análise de segurança é parte central da consulta e do acompanhamento.",
  },
  {
    question: "A consulta pode ser feita por telemedicina?",
    answer:
      "Sim. A avaliação, a prescrição quando indicada e o acompanhamento podem ser realizados por teleconsulta, conforme a regulamentação vigente de telemedicina no Brasil. Casos que exijam exame físico presencial são orientados a comparecer ao consultório em Goiânia.",
  },
  {
    question: "Vocês vendem ou indicam marcas de produtos?",
    answer:
      "Não. A atuação é exclusivamente médica: avaliação, prescrição quando há indicação e acompanhamento. A escolha do produto segue critérios técnicos (composição, certificados de análise, registro sanitário), sem vínculo comercial com fabricantes — conforme determina o Código de Ética Médica.",
  },
  {
    question: "O que é o laudo médico para cultivo domiciliar?",
    answer:
      "Quando há indicação clínica bem estabelecida e acompanhamento em curso, o médico pode emitir um relatório/laudo fundamentado que atesta a necessidade terapêutica do paciente. Esse documento é técnico e serve para subsidiar uma eventual ação judicial (habeas corpus preventivo) conduzida pelo advogado do paciente. O papel do médico é estritamente clínico — a decisão jurídica cabe ao Poder Judiciário e a condução do processo, ao advogado.",
  },
];

export default function EndocanabinoidePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36">
        <div className="mesh-bg" />
        <nav aria-label="Trilha de navegação" className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <ol className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
            <li className="flex items-center gap-2">
              <a href="/" className="transition-colors hover:text-[var(--fg)]">Início</a>
              <span aria-hidden="true" className="opacity-50">/</span>
            </li>
            <li>
              <span aria-current="page" className="text-[var(--accent)]">Medicina Endocanabinoide</span>
            </li>
          </ol>
        </nav>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal as="p" className="eyebrow mb-5">
              Medicina Endocanabinoide
            </Reveal>
            <Reveal
              as="h1"
              delay={70}
              className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              O sistema que regula o seu equilíbrio,{" "}
              <span className="text-gradient">tratado com ciência</span>
            </Reveal>
            <Reveal as="p" delay={150} className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Avaliação criteriosa, prescrição dentro das normas da Anvisa e do CFM e
              acompanhamento próximo — sem promessas milagrosas, com a honestidade que a
              boa medicina exige.
            </Reveal>
          </div>
          <div className="relative hidden h-[440px] lg:block">
            <ThreeScene kind="neural" className="absolute inset-0" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className="glass card-hover rounded-3xl p-8">
              <h2 className="font-display text-lg font-semibold tracking-tight">{p.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Condições frequentemente abordadas"
          title="Quando o tema costuma surgir na consulta"
          lede="A avaliação é sempre individual. A presença de uma condição nesta lista não significa indicação automática — significa que é um dos motivos pelos quais pacientes procuram avaliação."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {conditions.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 70} className="glass card-hover rounded-3xl p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Para quem"
              title="Uma avaliação honesta começa antes da prescrição"
              lede="O primeiro papel do médico é dizer se essa abordagem faz sentido para você — inclusive quando a resposta é não."
            />
            <ul className="mt-9 space-y-4">
              {forWhom.map((item, i) => (
                <Reveal as="li" key={i} delay={i * 70} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]"
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed text-muted">{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Como funciona"
              title="Acompanhamento em quatro etapas"
            />
            <ol className="mt-9 space-y-5">
              {process.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 70} className="glass rounded-2xl p-6">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sm font-semibold text-[var(--accent)]">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[0.93rem] leading-relaxed text-muted">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <PortraitSection
        eyebrow="Critério antes da conduta"
        title={
          <>
            Um campo novo exige <span className="text-gradient">mais rigor</span>, não menos
          </>
        }
        lede="A medicina endocanabinoide desperta entusiasmo — e é justamente por isso que precisa de critério redobrado. Aqui, cada indicação passa por revisão da literatura, análise de segurança e comparação honesta com as alternativas já estabelecidas. Se a evidência não sustenta, você vai ouvir isso com clareza."
        image="/images/dr-poltrona-pensativo.jpg"
        alt="Dr. José Victor sentado, em atitude reflexiva"
        reverse
      />

      {/* Laudo para cultivo domiciliar */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="glass overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow mb-4">Documentação médica</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Laudo médico para cultivo domiciliar
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                <p>
                  Para pacientes com indicação clínica bem estabelecida e em
                  acompanhamento, é possível emitir um{" "}
                  <strong className="text-[var(--fg)]">
                    relatório/laudo médico fundamentado
                  </strong>{" "}
                  que atesta a necessidade terapêutica. Esse documento pode subsidiar
                  uma ação judicial (habeas corpus preventivo) que autorize o cultivo
                  domiciliar para uso próprio.
                </p>
                <p>
                  O papel do médico é{" "}
                  <strong className="text-[var(--fg)]">estritamente clínico</strong>:
                  avaliar, indicar quando pertinente, acompanhar e documentar com
                  rigor técnico. A condução do processo judicial cabe ao advogado do
                  paciente, e a decisão, ao Poder Judiciário.
                </p>
              </div>
            </div>
            <ul className="space-y-4">
              {[
                "Avaliação clínica e confirmação de indicação terapêutica",
                "Acompanhamento documentado da resposta ao tratamento",
                "Emissão de laudo/relatório técnico fundamentado",
                "Orientação sobre o encaminhamento jurídico (conduzido por advogado)",
              ].map((item, i) => (
                <Reveal as="li" key={i} delay={i * 70} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono-tech mt-0.5 shrink-0 text-sm font-semibold text-[var(--accent)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-muted">{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <p className="mt-8 border-t hairline pt-6 text-xs leading-relaxed text-faint">
            Nenhum laudo é emitido sem avaliação clínica e indicação médica. Não há
            garantia de resultado no âmbito judicial — a decisão é sempre do Poder
            Judiciário.
          </p>
        </div>
      </section>

      <section className="relative mt-28 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Perguntas frequentes"
            title="O que os pacientes perguntam"
            align="center"
          />
          <div className="mt-12">
            <FaqAccordion items={faq} />
          </div>
        </div>
      </section>

      <CtaSection
        title="Avalie a sua elegibilidade"
        lede="Envie uma mensagem e agende uma avaliação criteriosa — presencial em Goiânia ou por telemedicina."
        message="Olá! Gostaria de agendar uma avaliação em medicina endocanabinoide com o Dr. José Victor."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Medicina Endocanabinoide", path: "/medicina-endocanabinoide" },
          ]),
          medicalWebPageSchema({
            title: "Medicina Endocanabinoide",
            description: metadata.description as string,
            path: "/medicina-endocanabinoide",
          }),
          serviceSchema({
            name: "Medicina Endocanabinoide",
            description:
              "Avaliação médica do sistema endocanabinoide, indicação individualizada e prescrição dentro das normas da Anvisa e do CFM.",
            path: "/medicina-endocanabinoide",
          }),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
