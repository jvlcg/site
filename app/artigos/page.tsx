import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { Counter } from "@/components/ui/Counter";
import {
  publications,
  publicationsByType,
  publicationStats,
  TYPE_LABEL,
  type Publication,
} from "@/lib/publications";
import { site } from "@/lib/site-config";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Artigos científicos e produção acadêmica",
  description:
    "Produção científica do Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508): artigos em periódicos sobre dor, anestesia e intervenção guiada por imagem, livro, capítulo e trabalhos em congressos.",
  alternates: { canonical: "/artigos" },
};

/** Destaca o nome do médico na lista de autores. */
function Authors({ value }: { value: string }) {
  const parts = value.split(/(Gomes JVLC|Lisboa Cardoso Gomes JV|Gomes JV L C)/g);
  return (
    <p className="mt-3 text-[0.82rem] leading-relaxed text-faint">
      {parts.map((p, i) =>
        /Gomes JVLC|Lisboa Cardoso Gomes JV/.test(p) ? (
          <strong key={i} className="font-semibold text-[var(--accent)]">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </p>
  );
}

function PubCard({ pub, delay }: { pub: Publication; delay: number }) {
  return (
    <Reveal delay={delay} className="holo glass card-hover flex h-full flex-col rounded-3xl p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono-tech text-[0.66rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          {TYPE_LABEL[pub.type]}
        </span>
        <span className="font-mono-tech text-[0.8rem] text-faint">{pub.year}</span>
      </div>
      <h3 className="font-display mt-4 text-[1.02rem] font-semibold leading-snug tracking-tight">
        {pub.title}
      </h3>
      <p className="mt-3 text-[0.88rem] italic leading-relaxed text-muted">
        {pub.venue}
        {pub.details && <span className="not-italic text-faint"> · {pub.details}</span>}
      </p>
      <div className="mt-auto">
        <Authors value={pub.authors} />
      </div>
    </Reveal>
  );
}

const grupos: { type: Publication["type"]; titulo: string; lede?: string }[] = [
  {
    type: "artigo",
    titulo: "Artigos em periódicos",
    lede: "Revisões sistemáticas e estudos originais publicados em revistas científicas, com foco em dor, anestesia e intervenção guiada por imagem.",
  },
  { type: "livro", titulo: "Livro" },
  { type: "capitulo", titulo: "Capítulo de livro" },
  {
    type: "anais",
    titulo: "Trabalhos completos em anais de congressos",
  },
  { type: "apresentacao", titulo: "Apresentações selecionadas em congressos" },
];

export default function ArtigosCientificosPage() {
  return (
    <>
      <PageHero
        fundo="acervo"
        eyebrow="Produção científica"
        title={
          <>
            Artigos <span className="text-gradient">científicos</span>
          </>
        }
        lede="Pesquisa publicada em periódicos, livro, capítulo e trabalhos apresentados em congressos — a base científica que sustenta a prática clínica no consultório."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Artigos científicos", path: "/artigos" },
        ]}
      />

      {/* Resumo numérico */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: String(publicationStats.artigos), l: "Artigos em periódicos revisados por pares" },
            { v: String(publicationStats.livros), l: "Livro organizado e capítulo publicado" },
            { v: String(publicationStats.apresentacoes), l: "Trabalhos apresentados em congressos" },
            { v: "1", l: "Atuação como revisor de periódico científico" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 70} className="holo glass rounded-2xl p-6">
              <dd className="font-mono-tech text-3xl font-semibold text-[var(--accent)]">
                <Counter value={s.v} />
              </dd>
              <dt className="mt-2 text-[0.85rem] leading-snug text-muted">{s.l}</dt>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-8 flex flex-wrap gap-4">
          <a
            href={site.sameAs[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Currículo Lattes completo ↗
          </a>
          <a
            href={site.sameAs[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            Perfil ORCID ↗
          </a>
        </Reveal>
      </section>

      {/* Listas por tipo */}
      {grupos.map((g, gi) => {
        const itens = publicationsByType(g.type);
        if (!itens.length) return null;
        return (
          <section key={g.type} className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
            <SectionHeading eyebrow={`0${gi + 1}`} title={g.titulo} lede={g.lede} />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {itens.map((p, i) => (
                <PubCard key={p.title} pub={p} delay={(i % 3) * 80} />
              ))}
            </div>
          </section>
        );
      })}

      <CtaSection
        title="Ciência aplicada ao seu caso"
        lede="A mesma leitura crítica que sustenta a pesquisa orienta cada conduta no consultório."
        message="Olá! Vi a produção científica do Dr. José Victor no site e gostaria de agendar uma consulta."
      />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Artigos científicos", path: "/artigos" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Produção científica",
            description: metadata.description as string,
            url: `${site.url}/artigos`,
            about: { "@id": `${site.url}/#physician` },
            hasPart: publications.map((p) => ({
              "@type": p.type === "artigo" ? "ScholarlyArticle" : "CreativeWork",
              headline: p.title,
              datePublished: String(p.year),
              isPartOf: p.venue,
              author: { "@id": `${site.url}/#physician` },
            })),
          },
        ]}
      />
    </>
  );
}
