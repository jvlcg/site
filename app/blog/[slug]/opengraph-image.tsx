import { imagemOg, TAMANHO_OG } from "@/lib/og";
import { getAllArticles, getArticle } from "@/lib/articles";

/**
 * A imagem de compartilhamento de cada artigo, gerada no build.
 *
 * ## O que estava quebrado
 *
 * O `metadata` de cada artigo apontava para `/og/blog/{slug}.png`. Nenhum
 * arquivo existia nesse caminho — os cinco que existiam estavam em
 * `/og/artigos/`, e os outros onze artigos não tinham imagem nenhuma. Medido
 * em produção: `/og/blog/…` devolvia 404 nos dezesseis.
 *
 * O efeito não aparece no site: aparece no WhatsApp, que é como o blog
 * circula de verdade. Paciente manda o link para um parente, e o cartão chega
 * sem imagem — só o texto, no meio de uma conversa cheia de cartões com
 * imagem.
 *
 * ## Por que gerada, e não um PNG por artigo
 *
 * Um arquivo por artigo é uma imagem para produzir à mão a cada texto novo, e
 * foi assim que onze ficaram sem. Gerada a partir do próprio frontmatter, todo
 * artigo já nasce com a sua — inclusive os que chegam sozinhos da Soro.
 *
 * A tarja é a **categoria** do artigo. Quem recebe o link vê "Sono" ou
 * "Cannabis medicinal" antes de abrir, em vez de um logotipo genérico.
 */
export const size = TAMANHO_OG;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  return imagemOg({
    eyebrow: article?.category ?? "Artigo",
    titulo: article?.title ?? "Artigo",
    /*
      A descrição do artigo é escrita para caber em 155 caracteres na busca —
      no cartão, com fonte grande, isso ainda estoura. O corte no último
      espaço evita terminar no meio de uma palavra.
    */
    linha: article ? cortar(article.description, 110) : undefined,
  });
}

function cortar(texto: string, limite: number) {
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite);
  return corte.slice(0, corte.lastIndexOf(" ")) + "…";
}
