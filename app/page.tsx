import Image from "next/image";
import Link from "next/link";
import { ThreeScene } from "@/components/three/ThreeScene";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { GoogleReviews } from "@/components/ui/GoogleReviews";
import { Counter } from "@/components/ui/Counter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Parallax } from "@/components/ui/Parallax";
import { EcgDivider } from "@/components/ui/EcgDivider";
import { BentoTech } from "@/components/sections/BentoTech";
import { clinicPhotos, doctorPhotos } from "@/lib/gallery";
import { getAllArticles } from "@/lib/articles";
import { site, whatsappLink } from "@/lib/site-config";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const areas = [
  {
    href: "/medicina-endocanabinoide",
    title: "Medicina Endocanabinoide",
    text: "Abordagem científica do sistema endocanabinoide no cuidado de condições crônicas, com prescrição criteriosa, individualizada e dentro das normas regulatórias.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-7 w-7">
        <circle cx="12" cy="12" r="2.4" />
        <circle cx="5" cy="7" r="1.6" />
        <circle cx="19" cy="7" r="1.6" />
        <circle cx="5" cy="17" r="1.6" />
        <circle cx="19" cy="17" r="1.6" />
        <path d="M6.4 7.9 10 10.7M17.6 7.9 14 10.7M6.4 16.1 10 13.3M17.6 16.1 14 13.3" />
      </svg>
    ),
  },
  {
    href: "/clinica-medica",
    title: "Clínica Médica & Check-up",
    text: "Avaliação clínica completa, prevenção e acompanhamento longitudinal — um médico de referência que enxerga sua saúde como um todo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M4.5 12.5 8 12.5 10 8l3 9 2-4.5h4.5" />
        <path d="M12 21c-4.5-3.2-8.5-6.6-8.5-11A5.3 5.3 0 0 1 12 6.4 5.3 5.3 0 0 1 20.5 10c0 4.4-4 7.8-8.5 11z" opacity="0.5" />
      </svg>
    ),
  },
  {
    href: "/medicina-esportiva",
    title: "Medicina Esportiva & Performance",
    text: "Saúde de quem treina: avaliação funcional, manejo de dor, retorno seguro ao esporte e otimização de rotina com base em evidências.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-7 w-7">
        <path d="M4 17c2.5 0 3.5-9 6-9s3.5 12 6 12 2.5-6 4-6" />
        <circle cx="4" cy="17" r="1.4" />
      </svg>
    ),
  },
];

const steps = [
  {
    n: "01",
    title: "Primeiro contato",
    text: "Você fala diretamente com o consultório pelo WhatsApp e escolhe entre atendimento presencial em Goiânia ou teleconsulta.",
  },
  {
    n: "02",
    title: "Consulta aprofundada",
    text: "Avaliação clínica detalhada: histórico completo, exames, hábitos e objetivos — tempo de consulta dedicado a ouvir e investigar.",
  },
  {
    n: "03",
    title: "Plano individualizado",
    text: "Conduta terapêutica personalizada e explicada com transparência, fundamentada em evidências científicas atuais.",
  },
  {
    n: "04",
    title: "Acompanhamento contínuo",
    text: "Reavaliações programadas, ajustes de conduta e canal direto com o consultório ao longo de todo o tratamento.",
  },
];

const credentials = [
  { value: "PUC-GO", label: "Graduação em Medicina · Magna Cum Laude" },
  { value: "6+", label: "Artigos publicados em periódicos científicos" },
  { value: "20+", label: "Trabalhos apresentados em congressos médicos" },
  { value: "ACLS", label: "Suporte Avançado de Vida — American Heart Association" },
];

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
        <div className="mesh-bg" />
        <ThreeScene kind="neural" className="absolute inset-0" />
        <div className="scrim" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal as="p" className="font-mono-tech mb-6 inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Goiânia-GO · Presencial e Telemedicina
            </Reveal>
            <Reveal
              as="h1"
              delay={80}
              className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]"
            >
              Medicina de precisão,{" "}
              <span className="text-gradient">guiada por ciência</span> e pelo seu
              contexto.
            </Reveal>
            <Reveal as="p" delay={170} className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Clínica médica, medicina endocanabinoide e medicina esportiva em um
              cuidado integrado: consultas aprofundadas, plano terapêutico
              individualizado e acompanhamento próximo — no consultório ou onde você
              estiver.
            </Reveal>
            <Reveal delay={260} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Agendar consulta
                  <span aria-hidden="true">→</span>
                </a>
              </MagneticButton>
              <Link href="/sobre" className="btn-ghost">
                Conhecer o Dr. José Victor
              </Link>
            </Reveal>
            <Reveal delay={340} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[0.8rem] text-faint">
              <span>{site.crm}</span>
              <span>Formação PUC-GO · Magna Cum Laude</span>
              <span>Pesquisador com publicações em dor e intervenção</span>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="animate-float relative">
              <div className="glass relative overflow-hidden rounded-[1.8rem] p-2">
                <Image
                  src="/images/dr-retrato-gravata.jpg"
                  alt="Dr. José Victor Lisboa Cardoso Gomes, médico, em traje social ajustando a gravata"
                  width={650}
                  height={975}
                  priority
                  sizes="(max-width: 1024px) 90vw, 460px"
                  className="rounded-[1.4rem] object-cover"
                />
              </div>
              <div className="glass absolute -left-6 bottom-10 hidden rounded-2xl px-5 py-4 sm:block">
                <p className="font-display text-sm font-semibold">{site.crm}</p>
                <p className="mt-0.5 text-xs text-faint">Registro ativo · Goiás</p>
              </div>
              <div className="glass absolute -right-4 top-10 hidden rounded-2xl px-5 py-4 sm:block">
                <p className="font-display text-sm font-semibold text-[var(--accent)]">
                  Telemedicina
                </p>
                <p className="mt-0.5 text-xs text-faint">Todo o Brasil</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- ÁREAS DE ATUAÇÃO ---------- */}
      <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Áreas de atuação"
          title={
            <>
              Três frentes, <span className="text-gradient">um cuidado integrado</span>
            </>
          }
          lede="Cada área é conduzida com o mesmo método: escuta detalhada, avaliação criteriosa e decisões compartilhadas com base na melhor evidência disponível."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.href} delay={i * 90}>
              <TiltCard className="h-full">
                <Link
                  href={area.href}
                  className="holo glass card-hover group flex h-full flex-col rounded-3xl p-8"
                >
                  <span className="glass flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--accent)]">
                    {area.icon}
                  </span>
                  <h3 className="font-display mt-7 text-xl font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">
                    {area.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                    Saiba mais
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- TECNOLOGIA (BENTO) ---------- */}
      <BentoTech />

      {/* ---------- JORNADA DO PACIENTE ---------- */}
      <section className="relative mt-32 overflow-hidden py-24">
        <div className="mesh-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Como funciona"
            title="Uma jornada desenhada para resolver"
            lede="Do primeiro contato ao acompanhamento de longo prazo, cada etapa é pensada para você sentir clareza sobre o que está acontecendo e o porquê de cada decisão."
            align="center"
          />
          <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 90} className="relative">
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
        </div>
      </section>

      <EcgDivider />

      {/* ---------- AUTORIDADE ---------- */}
      <section className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative order-2 mx-auto w-full max-w-sm lg:order-1">
            <div className="glass overflow-hidden rounded-[1.8rem] p-2">
              <div className="overflow-hidden rounded-[1.4rem]">
              <Parallax speed={0.16}>
              <Image
                src="/images/dr-jaleco-braco.jpg"
                alt="Dr. José Victor sorrindo, com o jaleco médico no braço"
                width={650}
                height={975}
                sizes="(max-width: 1024px) 90vw, 420px"
                className="scale-[1.12] rounded-[1.4rem] object-cover"
              />
              </Parallax>
              </div>
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Formação e pesquisa"
              title={
                <>
                  Prática clínica com <span className="text-gradient">rigor científico</span>
                </>
              }
              lede="Médico formado pela PUC Goiás com honraria Magna Cum Laude, autor de publicações científicas em dor, intervenção guiada por imagem e trauma, e revisor de periódico internacional da área da saúde."
            />
            <dl className="mt-10 grid grid-cols-2 gap-5">
              {credentials.map((c, i) => (
                <Reveal key={c.label} delay={i * 80} className="glass rounded-2xl p-6">
                  <dt className="order-2 mt-2 block text-[0.82rem] leading-snug text-muted">
                    {c.label}
                  </dt>
                  <dd className="font-mono-tech order-1 block text-2xl font-semibold text-[var(--accent)]">
                    <Counter value={c.value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={160} className="mt-8">
              <Link href="/sobre" className="btn-ghost text-sm">
                Ver trajetória completa e publicações
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- UNIDADE PRESENCIAL ---------- */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow="Unidade presencial · Setor Sul"
              title={
                <>
                  Um consultório <span className="text-gradient">para chamar de seu</span>
                </>
              }
              lede="Atendimento na Clínica Fisiogyn, na Rua 94, em Goiânia: recepção confortável, ambiente climatizado e estrutura de apoio diagnóstico no mesmo endereço. Conheça o espaço antes mesmo da primeira consulta."
            />
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-4">
              <MagneticButton>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Agendar presencial
                  <span aria-hidden="true">→</span>
                </a>
              </MagneticButton>
              <Link href="/consultorio" className="btn-ghost">
                Ver fotos e localização
              </Link>
            </Reveal>
          </div>

          <Reveal delay={120} className="grid grid-cols-2 gap-4">
            {[clinicPhotos[0], doctorPhotos[1], clinicPhotos[2], clinicPhotos[3]].map((p, i) => (
              <Link
                key={p.src}
                href="/consultorio"
                className={`holo glass group relative block overflow-hidden rounded-2xl ${
                  i === 0 ? "col-span-2" : ""
                }`}
              >
                <span className={`block overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 1024px) 45vw, 300px"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- PROVA SOCIAL ---------- */}
      <GoogleReviews className="mt-28" />

      {/* ---------- ARTIGOS ---------- */}
      {articles.length > 0 && (
        <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Conteúdo científico"
              title="Artigos e atualizações"
              lede="Educação em saúde com base em evidências — sem promessas, sem atalhos."
            />
            <Reveal>
              <Link href="/artigos" className="btn-ghost text-sm">
                Todos os artigos
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <Link
                  href={`/artigos/${a.slug}`}
                  className="glass card-hover group flex h-full flex-col rounded-3xl p-7"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {a.category}
                  </p>
                  <h3 className="font-display mt-4 text-lg font-semibold leading-snug tracking-tight">
                    {a.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {a.description}
                  </p>
                  <p className="mt-5 text-xs text-faint">
                    {new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {a.readingMinutes} min de leitura
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaSection />
      <JsonLd data={breadcrumbSchema([{ name: "Início", path: "/" }])} />
    </>
  );
}
