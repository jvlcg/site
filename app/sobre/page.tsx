import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { Parallax } from "@/components/ui/Parallax";
import { JsonLd, breadcrumbSchema, medicalWebPageSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre o Dr. José Victor — formação, pesquisa e publicações",
  description:
    "Trajetória do Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508): graduação em Medicina pela PUC-GO com Magna Cum Laude, pesquisa em dor e intervenção guiada por imagem, publicações científicas e certificação ACLS.",
  alternates: { canonical: "/sobre" },
};

const timeline = [
  {
    period: "2020 — 2025",
    title: "Graduação em Medicina — PUC Goiás",
    text: "Formação médica concluída com a honraria Magna Cum Laude (Prata em Mérito Acadêmico). Diretor acadêmico da Liga de Cirurgia do Trauma e organizador de eventos e ações sociais.",
  },
  {
    period: "2020 — 2021",
    title: "Início na pesquisa clínica",
    text: "Primeiros estudos em intervenção guiada por ultrassom para dor (bloqueios ecoguiados), apresentados em congressos da SBOT e da SBUS. Voluntário na campanha de vacinação contra a COVID-19.",
  },
  {
    period: "2022 — 2024",
    title: "Produção científica e extensão",
    text: "Publicações e apresentações em dor, trauma e anestesia regional; projeto comunitário premiado em 2º lugar no I Fórum de Extensão de Medicina da PUC-GO; internato com estágios hospitalares, incluindo o Hospital Estadual Dr. Alberto Rassi (HGG).",
  },
  {
    period: "2025",
    title: "Registro médico e certificações",
    text: "Registro no Conselho Regional de Medicina de Goiás (CRM-GO 38508). Certificação ACLS pela American Heart Association, formação em revisão por pares pela Elsevier e atuação como revisor do periódico Clinics.",
  },
  {
    period: "Hoje",
    title: "Prática clínica integrada",
    text: "Atendimento em clínica médica, medicina endocanabinoide e medicina esportiva na Clínica Fisiogyn, em Goiânia, e por telemedicina para todo o Brasil — unindo tecnologia, dados e medicina baseada em evidências.",
  },
];

const publications = [
  {
    title:
      "Carpal tunnel syndrome: a systematic review of conservative and surgical treatments on pain and functional recovery",
    venue: "Revista Eletrônica Acervo em Saúde, 2025",
  },
  {
    title:
      "Perfil farmacológico e papel da ketamina na redução da dor crônica após procedimentos cirúrgicos — revisão sistemática",
    venue: "Studies in Health Sciences, 2025",
  },
  {
    title:
      "Anestesia locorregional em pediatria: avaliação de riscos e benefícios em procedimentos ambulatoriais",
    venue: "Studies in Health Sciences, 2025",
  },
  {
    title:
      "Relação entre anestesia espinhal e parada cardiorrespiratória — revisão sistemática",
    venue: "Studies in Health Sciences, 2025",
  },
  {
    title:
      "Approach with ultrasound-guided piriformis blocks for pain relief and confirmation of the clinical diagnosis of deep gluteal pain",
    venue: "Revista Brasileira de Ultrassonografia, 2021",
  },
  {
    title:
      "Estudo retrospectivo dos últimos 100 casos de bloqueio ecoguiado lombar para facetas e ramos mediais em clínica de referência em Goiânia",
    venue: "Revista Brasileira de Ultrassonografia, 2021",
  },
  {
    title:
      "Impacto da simulação em cirurgia de trauma na formação médica — capítulo em “A Medicina do Futuro: Uma Revisão Multidisciplinar”",
    venue: "Editora Health, 2024",
  },
  {
    title:
      "Trauma, Cirurgia e Medicina Intensiva: Teoria e Prática — Edição I (coautoria/organização)",
    venue: "2024",
  },
];

const values = [
  {
    title: "Evidência antes de tendência",
    text: "Toda conduta nasce da literatura científica atual — revisões sistemáticas, diretrizes e leitura crítica fazem parte da rotina do consultório.",
  },
  {
    title: "Tempo de escuta",
    text: "Consulta com espaço real para a sua história. Diagnóstico bom começa com anamnese bem feita, não com pressa.",
  },
  {
    title: "Transparência",
    text: "Você entende o raciocínio por trás de cada decisão: opções, alternativas, custos e limites do que a medicina pode oferecer.",
  },
  {
    title: "Tecnologia a favor do cuidado",
    text: "Documentação estruturada, protocolos assistidos e acompanhamento digital — dados organizados para decisões clínicas melhores.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title={
          <>
            Dr. José Victor{" "}
            <span className="text-gradient">Lisboa Cardoso Gomes</span>
          </>
        }
        lede="Médico pela PUC Goiás (Magna Cum Laude), pesquisador com publicações em dor, intervenção guiada por imagem e trauma. Clínica médica, medicina endocanabinoide e medicina esportiva — em Goiânia e por telemedicina."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Sobre", path: "/sobre" },
        ]}
      />

      {/* Bio + foto */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
            <div className="glass overflow-hidden rounded-[1.8rem] p-2">
              <Image
                src="/images/dr-jose-victor-jaleco-2.jpg"
                alt="Dr. José Victor de jaleco com o brasão da PUC Goiás"
                width={600}
                height={900}
                priority
                className="rounded-[1.4rem] object-cover"
              />
            </div>
            <div className="glass mt-4 rounded-2xl p-5 text-sm leading-relaxed text-muted">
              <p className="font-display font-semibold text-[var(--fg)]">{site.crm}</p>
              <p className="mt-1">
                Membro de comunidade científica ativa —{" "}
                <a
                  href={site.sameAs[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  Currículo Lattes
                </a>{" "}
                ·{" "}
                <a
                  href={site.sameAs[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  ORCID
                </a>
              </p>
            </div>
          </Reveal>

          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <Reveal as="p">
              Sou médico formado pela Pontifícia Universidade Católica de Goiás, com
              perfil clínico-analítico e uma convicção simples:{" "}
              <strong className="text-[var(--fg)]">
                boa medicina é ciência aplicada com atenção genuína à pessoa
              </strong>
              . Minha trajetória começou cedo na pesquisa — ainda na graduação,
              participei de estudos sobre dor crônica e procedimentos guiados por
              ultrassom apresentados em congressos nacionais e internacionais.
            </Reveal>
            <Reveal as="p" delay={80}>
              Essa base científica define como atendo hoje: leitura crítica da
              literatura, protocolos claros e decisões compartilhadas. Na medicina
              endocanabinoide, aplico esse mesmo rigor a um campo em rápida evolução —
              avaliando indicação, segurança e evidência caso a caso, sem promessas e
              sem modismos.
            </Reveal>
            <Reveal as="p" delay={160}>
              Na clínica médica e na medicina esportiva, meu papel é ser o ponto de
              integração da sua saúde: investigar a fundo, prevenir com estratégia e
              acompanhar de perto — presencialmente em Goiânia ou por telemedicina, com
              a mesma qualidade de atenção.
            </Reveal>
            <Reveal as="p" delay={240}>
              Fora do consultório, sou{" "}
              <strong className="text-[var(--fg)]">escritor e poeta</strong>. Assino
              capítulos e organização de obras acadêmicas na área médica e escrevo
              poesia desde a adolescência — textos publicados de forma independente e
              reunidos aqui em{" "}
              <Link
                href="/poemas"
                className="text-[var(--accent)] underline underline-offset-4"
              >
                uma página à parte
              </Link>
              . É escrita pessoal, sem relação com a prática clínica, mas vem do mesmo
              lugar: o hábito de olhar de perto e nomear com precisão.
            </Reveal>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 70} className="glass rounded-2xl p-6">
                  {/* h2, e não h3: nada de h2 vem antes nesta página, e pular
                      nível quebra a navegação por títulos de quem usa leitor de
                      tela. O tamanho visual é dado pela classe, não pela tag. */}
                  <h2 className="font-display text-base font-semibold text-[var(--fg)]">
                    {v.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed">{v.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faixa editorial — retrato em preto e branco */}
      <section className="relative mt-32 overflow-hidden">
        <div className="relative h-[62vh] min-h-[420px] w-full sm:h-[78vh]">
          <Parallax speed={0.22} className="absolute inset-0">
            <Image
              src="/images/dr-jose-victor-perfil-pb.jpg"
              alt="Retrato em preto e branco do Dr. José Victor de perfil"
              fill
              sizes="100vw"
              className="scale-[1.15] object-cover object-[center_22%]"
            />
          </Parallax>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--bg) 2%, color-mix(in oklab, var(--bg) 55%, transparent) 45%, transparent 78%), linear-gradient(to top, var(--bg) 3%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <Reveal as="p" className="eyebrow mb-5">
                Método
              </Reveal>
              <Reveal
                as="blockquote"
                delay={80}
                className="font-display max-w-2xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:text-4xl"
              >
                “Diagnóstico bom começa com{" "}
                <span className="text-gradient">anamnese bem feita</span> — não com
                pressa.”
              </Reveal>
              <Reveal as="p" delay={160} className="mt-5 max-w-xl leading-relaxed text-muted">
                Cada consulta é conduzida com o tempo que a investigação exige, unindo
                escuta atenta, exame criterioso e leitura crítica da literatura.
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="relative mt-24 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Trajetória"
            title="Da pesquisa ao consultório"
            align="center"
          />
          <ol className="relative mx-auto mt-16 max-w-3xl space-y-10 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-[var(--accent)] before:via-[var(--line)] before:to-transparent sm:space-y-12">
            {timeline.map((item, i) => (
              <Reveal as="li" key={item.period} delay={i * 60} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-[var(--accent)] bg-[var(--bg)]"
                />
                <p className="font-display text-sm font-semibold text-[var(--accent)]">
                  {item.period}
                </p>
                <h3 className="font-display mt-1.5 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Publicações */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Produção científica"
          title="Publicações selecionadas"
          lede="Artigos em periódicos, capítulos de livro e trabalhos apresentados em congressos — a lista completa está disponível no Currículo Lattes."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {publications.map((pub, i) => (
            <Reveal as="li" key={pub.title} delay={(i % 2) * 70}>
              <div className="glass card-hover h-full rounded-2xl p-6">
                <p className="font-display text-[0.98rem] font-medium leading-snug">
                  {pub.title}
                </p>
                <p className="mt-3 text-sm text-faint">{pub.venue}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        {/*
          O voluntariado sai daqui, e não do menu do topo.

          É a continuação natural desta seção: internato, extensão premiada e
          liga acadêmica já aparecem no currículo acima, e a página de projetos
          voluntários é onde isso está contado por inteiro. Quem chega até as
          publicações é justamente quem quer saber quem atende — e era o único
          leitor que não tinha como chegar lá.
        */}
        <Reveal className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.sameAs[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Currículo Lattes completo ↗
          </a>
          <Link href="/voluntariado" className="btn-ghost text-sm">
            Projetos voluntários →
          </Link>
        </Reveal>
      </section>

      {/* Fechamento humano */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="Antes de tudo, gente"
              title={
                <>
                  Ciência de ponta, <span className="text-gradient">relação humana</span>
                </>
              }
              lede="Tecnologia, dados e evidência existem para servir a um propósito simples: você se sentir ouvido, entender o que está acontecendo com a sua saúde e saber exatamente qual é o próximo passo."
            />
          </div>
          <Reveal delay={120} className="relative mx-auto w-full max-w-md">
            <div className="glass overflow-hidden rounded-[1.8rem] p-2">
              <div className="overflow-hidden rounded-[1.4rem]">
                <Parallax speed={0.12}>
                  <Image
                    src="/images/dr-jose-victor-perfil-sorriso.jpg"
                    alt="Dr. José Victor sorrindo, de perfil, em traje social"
                    width={700}
                    height={1050}
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="scale-[1.1] rounded-[1.4rem] object-cover"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection
        title="Vamos conversar sobre a sua saúde?"
        message="Olá! Li sobre a trajetória do Dr. José Victor no site e gostaria de agendar uma consulta."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ]),
          medicalWebPageSchema({
            title: "Sobre o Dr. José Victor Lisboa Cardoso Gomes",
            description: metadata.description as string,
            path: "/sobre",
          }),
        ]}
      />
    </>
  );
}
