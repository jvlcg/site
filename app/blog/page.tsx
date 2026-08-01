import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Notificacoes } from "@/components/ui/Notificacoes";
import { getAllArticles } from "@/lib/articles";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Artigos — educação em saúde baseada em evidências",
  description:
    "Conteúdo médico educativo sobre medicina endocanabinoide, clínica médica, check-up e medicina esportiva, escrito pelo Dr. José Victor (CRM-GO 38508).",
  alternates: { canonical: "/blog" },
};

export default function ArtigosPage() {
  const articles = getAllArticles();

  return (
    <>
      <PageHero
        eyebrow="Artigos"
        title={
          <>
            Educação em saúde, <span className="text-gradient">sem atalhos</span>
          </>
        }
        lede="Conteúdo escrito com o mesmo rigor das publicações científicas: referências claras, linguagem acessível e zero promessas vazias."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 80}>
              <Link
                href={`/blog/${a.slug}`}
                className="glass card-hover group flex h-full flex-col rounded-3xl p-7"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {a.category}
                </p>
                <h2 className="font-display mt-4 text-xl font-semibold leading-snug tracking-tight">
                  {a.title}
                </h2>
                <p className="mt-3 flex-1 text-[0.93rem] leading-relaxed text-muted">
                  {a.description}
                </p>
                <p className="mt-6 text-xs text-faint">
                  {new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {a.readingMinutes} min de leitura
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Aviso de conteúdo novo. Fica aqui, e não no carregamento da home,
          porque quem está no blog é justamente quem tem motivo para querer. */}
      <section className="mx-auto mt-24 max-w-4xl px-5 sm:px-8">
        <Reveal>
          <Notificacoes />
        </Reveal>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
    </>
  );
}
