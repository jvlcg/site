import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FAQ_COMPLETO, CATEGORIAS, faqForSchema } from "@/lib/chat-faq";
import { DESTINOS, repartirComLinks } from "@/lib/auto-links";
import { site, whatsappLink } from "@/lib/site-config";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description:
    "Respostas diretas sobre agendamento, valores, convênios, telemedicina, consultório em Goiânia e cannabis medicinal — sem precisar ligar para perguntar.",
  alternates: { canonical: "/perguntas-frequentes" },
};

/**
 * Trecho de texto comum, com os hiperlinks internos automáticos aplicados.
 * O `usados` é compartilhado por toda a página (ver `linkados` abaixo), então
 * cada destino é citado uma única vez — o leitor não vê a mesma palavra virar
 * link em resposta após resposta.
 */
function Texto({ children, usados }: { children: string; usados: Set<string> }) {
  const trechos = repartirComLinks(children, usados, "/perguntas-frequentes", DESTINOS.length);
  return (
    <>
      {trechos.map((t, i) =>
        t.href ? (
          <Link
            key={i}
            href={t.href}
            className="text-[var(--accent)] underline decoration-[color-mix(in_oklab,var(--accent)_40%,transparent)] underline-offset-4"
          >
            {t.texto}
          </Link>
        ) : (
          <span key={i}>{t.texto}</span>
        )
      )}
    </>
  );
}

/** Converte **negrito** e listas em elementos, preservando parágrafos. */
function Answer({ text, usados }: { text: string; usados: Set<string> }) {
  return (
    <div className="space-y-3">
      {text.split("\n\n").map((par, i) => (
        <p key={i} className="leading-relaxed text-muted">
          {par.split("\n").map((line, k) => (
            <span key={k} className={k > 0 ? "mt-1.5 block" : ""}>
              {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={j} className="font-semibold text-[var(--fg)]">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <Texto key={j} usados={usados}>
                    {part}
                  </Texto>
                )
              )}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function PerguntasFrequentesPage() {
  // destinos já linkados nesta página — ver `Texto`
  const linkados = new Set<string>();

  return (
    <>
      <PageHero
        fundo="pendulo"
        eyebrow="Dúvidas"
        title={
          <>
            Perguntas <span className="text-gradient">frequentes</span>
          </>
        }
        lede="Respostas diretas sobre agendamento, atendimento presencial em Goiânia, telemedicina e as áreas de atuação — sem rodeios e sem promessas."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Perguntas frequentes", path: "/perguntas-frequentes" },
        ]}
      >
        <MagneticButton>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Não achou sua dúvida? Fale conosco
            <span aria-hidden="true">→</span>
          </a>
        </MagneticButton>
      </PageHero>

      {/* índice de categorias */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <a
              key={c}
              href={`#${c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`}
              className="glass rounded-full px-4 py-2 text-[0.82rem] text-muted transition-colors hover:text-[var(--accent)]"
            >
              {c}
            </a>
          ))}
        </Reveal>
      </section>

      {/* perguntas por categoria */}
      {CATEGORIAS.map((categoria) => {
        const itens = FAQ_COMPLETO.filter((f) => f.categoria === categoria);
        if (!itens.length) return null;
        const anchor = categoria.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        return (
          <section key={categoria} id={anchor} className="mx-auto mt-20 max-w-4xl px-5 scroll-mt-28 sm:px-8">
            <SectionHeading eyebrow="Categoria" title={categoria} />
            <div className="mt-8 space-y-4">
              {itens.map((f, i) => (
                <Reveal key={f.q} delay={(i % 4) * 60}>
                  <details className="holo glass group rounded-2xl px-6 py-5" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.02rem] font-medium transition-colors hover:text-[var(--accent)] [&::-webkit-details-marker]:hidden">
                      <h3>{f.full ?? f.q}</h3>
                      <span
                        aria-hidden="true"
                        className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-light transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pt-4">
                      <Answer text={f.a} usados={linkados} />
                      {f.cta && (
                        <a
                          href={whatsappLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
                        >
                          Agendar consulta pelo WhatsApp →
                        </a>
                      )}
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}

      {/* páginas relacionadas — ajuda buscadores a entender o contexto */}
      <section className="mx-auto mt-24 max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Saiba mais" title="Páginas relacionadas" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/consultorio", t: "Consultório em Goiânia", d: "Fotos da estrutura, mapa e como chegar." },
            { href: "/telemedicina", t: "Telemedicina", d: "Passo a passo da consulta por vídeo." },
            { href: "/cannabis-medicinal", t: "Cannabis medicinal", d: "O que é, para quem e como funciona." },
            { href: "/artigos", t: "Artigos científicos", d: "Produção publicada em periódicos e congressos." },
          ].map((l, i) => (
            <Reveal key={l.href} delay={(i % 2) * 70}>
              <Link href={l.href} className="holo glass card-hover block rounded-2xl p-6">
                <p className="font-display font-semibold">{l.t}</p>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">{l.d}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title="Ainda ficou com dúvida?"
        lede="Toda dúvida que envolve o seu caso específico merece uma avaliação médica. Fale com o consultório e agende sua consulta."
        message="Olá! Vi as perguntas frequentes no site e gostaria de agendar uma consulta."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Perguntas frequentes", path: "/perguntas-frequentes" },
          ]),
          medicalWebPageSchema({
            title: "Perguntas frequentes",
            description: metadata.description as string,
            path: "/perguntas-frequentes",
          }),
          faqSchema(faqForSchema()),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: `${site.url}/perguntas-frequentes`,
            citation: `${site.name} (${site.crm}). Perguntas frequentes. ${site.url}/perguntas-frequentes`,
          },
        ]}
      />
    </>
  );
}
