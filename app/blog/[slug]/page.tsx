import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Reveal } from "@/components/ui/Reveal";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { getAllArticles, getArticle } from "@/lib/articles";
import { rehypeLinksInternos } from "@/lib/rehype-auto-link";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      authors: [site.name],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: `/og/blog/${slug}.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`/og/blog/${slug}.png`],
    },
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <article className="relative overflow-hidden pt-32 sm:pt-36">
        <div className="mesh-bg opacity-50" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <nav aria-label="Trilha de navegação" className="mb-7">
            <ol className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              <li className="flex items-center gap-2">
                <Link href="/" className="transition-colors hover:text-[var(--fg)]">Início</Link>
                <span aria-hidden="true" className="opacity-50">/</span>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/blog" className="transition-colors hover:text-[var(--fg)]">Artigos</Link>
                <span aria-hidden="true" className="opacity-50">/</span>
              </li>
              <li>
                <span aria-current="page" className="text-[var(--accent)]">{article.category}</span>
              </li>
            </ol>
          </nav>
          <Reveal as="p" className="eyebrow">
            {article.category}
          </Reveal>
          <Reveal
            as="h1"
            delay={70}
            className="font-display mt-4 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.9rem]"
          >
            {article.title}
          </Reveal>
          <Reveal as="p" delay={140} className="mt-5 text-lg leading-relaxed text-muted">
            {article.description}
          </Reveal>
          <Reveal delay={200} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-y hairline py-4 text-sm text-faint">
            <span>
              Por <strong className="font-medium text-[var(--fg)]">{site.name}</strong> · {site.crm}
            </span>
            <span>
              {new Date(article.date + "T12:00:00").toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>{article.readingMinutes} min de leitura</span>
          </Reveal>

          <div className="prose-medical mt-10">
            {/*
              Os hiperlinks internos são inseridos aqui, na renderização — não
              no arquivo do artigo. Assim todo artigo novo já sai com eles,
              inclusive os que chegam sozinhos da Soro, e o texto em `.mdx`
              continua limpo. Ver `lib/auto-links.ts`.
            */}
            <MDXRemote
              source={article.content}
              options={{ mdxOptions: { rehypePlugins: [rehypeLinksInternos] } }}
            />
          </div>

          {article.faq.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Perguntas frequentes
              </h2>
              <div className="mt-6">
                <FaqAccordion items={article.faq} />
              </div>
            </div>
          )}

          {/* autor */}
          <div className="glass mt-14 flex flex-col gap-6 rounded-3xl p-7 sm:flex-row sm:items-center">
            <Image
              src="/images/dr-jose-victor-jaleco.jpg"
              alt="Dr. José Victor Lisboa Cardoso Gomes"
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover object-top"
            />
            <div>
              <p className="font-display font-semibold">{site.name}</p>
              <p className="mt-0.5 text-sm text-faint">{site.crm} · Médico pela PUC-GO</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Clínica médica, medicina endocanabinoide e medicina esportiva, em
                Goiânia e por telemedicina. Autor de publicações científicas em dor e
                intervenção guiada por imagem.
              </p>
              <Link
                href="/sobre"
                className="mt-3 inline-block text-sm font-medium text-[var(--accent)]"
              >
                Conhecer trajetória →
              </Link>
            </div>
          </div>

          <p className="mt-8 rounded-2xl border hairline p-5 text-xs leading-relaxed text-faint">
            Este conteúdo tem caráter exclusivamente educativo e não substitui consulta
            médica. Diagnósticos e tratamentos devem ser sempre individualizados por um
            profissional habilitado.
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-3xl px-5 sm:px-8">
          <h2 className="font-display text-xl font-semibold tracking-tight">Leia também</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="glass card-hover rounded-2xl p-6"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {a.category}
                </p>
                <p className="font-display mt-3 font-semibold leading-snug">{a.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaSection />

      <JsonLd
        data={[
          articleSchema({
            title: article.title,
            description: article.description,
            slug: article.slug,
            date: article.date,
            modified: article.updated,
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
          ...(article.faq.length > 0 ? [faqSchema(article.faq)] : []),
        ]}
      />
    </>
  );
}
