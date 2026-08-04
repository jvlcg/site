import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { POEMAS_COM_ANALISE, getPoema, vizinhos } from "@/content/poemas";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POEMAS_COM_ANALISE.map((p) => ({ slug: p.slug }));
}

/**
 * A descrição de busca sai da primeira frase da análise, não do poema.
 *
 * O primeiro verso raramente explica de que o poema trata — é justamente
 * função dele não explicar. A abertura da análise, sim: ela diz em uma frase
 * qual é a forma e qual é o assunto, que é o que alguém precisa ler no
 * resultado do Google para decidir se clica.
 */
function resumo(paragrafo: string) {
  const corte = paragrafo.slice(0, 155);
  if (paragrafo.length <= 155) return paragrafo;
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const poema = getPoema(slug);
  if (!poema?.analise) return {};

  const descricao = resumo(poema.analise[0]);

  return {
    title: `${poema.titulo} — poema e análise`,
    description: descricao,
    alternates: { canonical: `/poemas/${slug}` },
    openGraph: {
      type: "article",
      title: `${poema.titulo} — poema e análise`,
      description: descricao,
      authors: [site.name],
    },
  };
}

export default async function PoemaPage({ params }: Props) {
  const { slug } = await params;
  const poema = getPoema(slug);
  // Sem análise não há página: a listagem já mostra o poema inteiro, e uma
  // página que só o repete seria conteúdo duplicado do próprio site.
  if (!poema?.analise) notFound();

  const { anterior, proximo } = vizinhos(slug);

  return (
    <>
      <article className="relative overflow-hidden pt-32 pb-24 sm:pt-36">
        <div className="mesh-bg opacity-50" />
        <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
          <nav aria-label="Trilha de navegação" className="mb-7">
            <ol className="font-mono-tech flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              <li className="flex items-center gap-2">
                <Link href="/" className="transition-colors hover:text-[var(--fg)]">
                  Início
                </Link>
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/poemas" className="transition-colors hover:text-[var(--fg)]">
                  Poemas
                </Link>
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              </li>
              <li>
                <span aria-current="page" className="text-[var(--accent)]">
                  {poema.titulo}
                </span>
              </li>
            </ol>
          </nav>

          <Reveal imediato as="p" className="eyebrow">
            Poema
          </Reveal>
          <Reveal
            imediato
            as="h1"
            delay={70}
            className="font-display mt-4 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl"
          >
            {poema.titulo}
          </Reveal>
          {poema.data && (
            <Reveal
              imediato
              as="p"
              delay={120}
              className="font-mono-tech mt-3 text-[0.7rem] uppercase tracking-[0.14em] text-faint"
            >
              {poema.data}
            </Reveal>
          )}

          {/* O poema. `whitespace-pre-line` preserva a quebra de verso — sem
              isso o navegador junta tudo num parágrafo corrido e a forma, que
              em poesia é metade do sentido, se perde. */}
          <Reveal
            imediato
            as="p"
            delay={170}
            className="mt-9 whitespace-pre-line text-[1.05rem] leading-[1.9] text-muted"
          >
            {poema.texto}
          </Reveal>

          {poema.dedicatoria && (
            <p className="mt-6 text-[0.9rem] italic leading-relaxed text-faint">
              {poema.dedicatoria}
            </p>
          )}

          <section className="mt-14 border-t hairline pt-10">
            <p className="eyebrow">Leitura</p>
            <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
              Análise literária
            </h2>
            <div className="mt-6 space-y-5 text-[1rem] leading-[1.8] text-muted">
              {poema.analise.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {(anterior || proximo) && (
            <nav
              aria-label="Outros poemas"
              className="mt-14 grid gap-4 border-t hairline pt-8 sm:grid-cols-2"
            >
              {anterior ? (
                <Link href={`/poemas/${anterior.slug}`} className="glass card-hover rounded-2xl p-5">
                  <p className="font-mono-tech text-[0.64rem] uppercase tracking-[0.16em] text-faint">
                    Anterior
                  </p>
                  <p className="font-display mt-2 font-semibold leading-snug">
                    {anterior.titulo}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {proximo && (
                <Link
                  href={`/poemas/${proximo.slug}`}
                  className="glass card-hover rounded-2xl p-5 sm:text-right"
                >
                  <p className="font-mono-tech text-[0.64rem] uppercase tracking-[0.16em] text-faint">
                    Próximo
                  </p>
                  <p className="font-display mt-2 font-semibold leading-snug">
                    {proximo.titulo}
                  </p>
                </Link>
              )}
            </nav>
          )}

          <p className="mt-10">
            <Link
              href="/poemas"
              className="text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
            >
              ← Ver todos os poemas
            </Link>
          </p>

          <p className="mt-10 rounded-2xl border hairline p-5 text-xs leading-relaxed text-faint">
            Texto de {site.name}. Publicação pessoal, sem conteúdo médico e sem
            relação com a atividade clínica.
          </p>
        </div>
      </article>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Poem",
            name: poema.titulo,
            /**
             * `author` aponta para o mesmo nó do médico já declarado no site.
             * É o que liga as duas facetas da mesma pessoa nos dados
             * estruturados sem misturar os assuntos: o poema fica sendo
             * literatura, escrita por alguém que o site já identifica.
             */
            author: { "@id": `${site.url}/#physician` },
            inLanguage: "pt-BR",
            url: `${site.url}/poemas/${poema.slug}`,
            genre: "Poesia",
            isAccessibleForFree: true,
          },
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Poemas", path: "/poemas" },
            { name: poema.titulo, path: `/poemas/${poema.slug}` },
          ]),
        ]}
      />
    </>
  );
}
