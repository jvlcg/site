import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Busca } from "@/components/ui/Busca";
import { indiceDeBusca } from "@/lib/indice-busca";

export const metadata: Metadata = {
  title: "Buscar no site",
  description:
    "Encontre artigos, aulas, poemas e páginas do site do Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508) por assunto.",
  alternates: { canonical: "/busca" },
  /*
    Fora do índice do Google de propósito.

    Uma página de busca não tem conteúdo próprio: o que ela mostra já está
    indexado nas páginas de origem. Deixá-la entrar cria endereços vazios
    concorrendo com o conteúdo de verdade — é o caso clássico que a
    documentação do Google chama de "página de resultado de busca interna".
  */
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function BuscaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const itens = indiceDeBusca();

  return (
    <>
      <PageHero
        fundo="foco"
        semente="busca"
        eyebrow="Busca"
        title={
          <>
            O que você <span className="text-gradient">procura</span>?
          </>
        }
        lede={`Artigos, aulas, poemas e páginas — ${itens.length} endereços, por assunto.`}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Busca", path: "/busca" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <Busca itens={itens} inicial={q ?? ""} />
      </section>
    </>
  );
}
