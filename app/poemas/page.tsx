import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { AnalisePoema } from "@/components/ui/AnalisePoema";
import { POEMAS } from "@/content/poemas";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Poemas",
  description:
    "Poemas escritos por José Victor Lisboa Cardoso Gomes. Escrita pessoal, publicada também em @poemas.mortos.",
  alternates: { canonical: "/poemas" },
  /**
   * Sem descrição de OpenGraph médica aqui, e sem palavra-chave de busca
   * local: esta página não disputa nada com o resto do site, e não deve
   * confundir quem procura consultório.
   */
  openGraph: { title: "Poemas", description: "Escrita pessoal de José Victor." },
};

export default function PoemasPage() {
  // Sem poemas, a página não existe — melhor 404 do que uma sala vazia.
  if (POEMAS.length === 0) notFound();

  return (
    <>
      <PageHero
        eyebrow="Escrita"
        title={
          <>
            <span className="text-gradient">Poemas</span>
          </>
        }
        lede="Escrita pessoal, sem relação com a atividade clínica. Também publicados em @poemas.mortos. Cada poema traz uma leitura crítica, que abre logo abaixo do texto."
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Poemas", path: "/poemas" },
        ]}
      />

      <section className="mx-auto mb-24 max-w-2xl px-5 sm:px-8">
        <div className="space-y-16">
          {POEMAS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 60}>
              <article id={p.slug} className="scroll-mt-28">
                <h2 className="font-display text-2xl font-semibold">{p.titulo}</h2>
                {p.data && (
                  <p className="font-mono-tech mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                    {p.data}
                  </p>
                )}
                {/*
                  `whitespace-pre-line` é o que faz um poema ser um poema.
                  Sem isso o navegador junta os versos num parágrafo corrido e
                  a forma — que em poesia é metade do sentido — se perde.

                  Fonte um pouco maior e entrelinha mais aberta que o resto do
                  site: verso pede ar em volta.
                */}
                <p className="mt-5 whitespace-pre-line text-[1.05rem] leading-[1.9] text-muted">
                  {p.texto}
                </p>
                {p.dedicatoria && (
                  <p className="mt-5 text-[0.9rem] italic leading-relaxed text-faint">
                    {p.dedicatoria}
                  </p>
                )}
                {p.analise && (
                  <AnalisePoema
                    slug={p.slug}
                    titulo={p.titulo}
                    paragrafos={p.analise}
                  />
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-20 border-t hairline pt-8 text-[0.82rem] leading-relaxed text-faint">
          Textos de {site.name}. Publicação pessoal, sem conteúdo médico e sem
          relação com a atividade clínica. As análises são leituras críticas dos
          próprios poemas, escritas para esta página.
        </p>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Poemas", path: "/poemas" },
        ])}
      />
    </>
  );
}
