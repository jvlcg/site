import { MAX_LINKS, repartirComLinks } from "./auto-links";

/**
 * Plugin que insere os hiperlinks internos automáticos nos artigos.
 *
 * Roda na hora de transformar o Markdown em HTML, então vale para todo artigo
 * que existe hoje e para todo artigo que entrar depois — inclusive os que
 * chegam sozinhos da Soro pelo `scripts/sync-soro.mjs`. Nenhum arquivo `.mdx`
 * precisa ser editado: o texto continua limpo, e os links aparecem na hora de
 * publicar.
 *
 * O que os links de um artigo têm em comum é o `Set` de destinos já usados —
 * é ele que faz a regra "uma menção por destino" valer no artigo inteiro, e não
 * parágrafo a parágrafo.
 */

/** Tipagem mínima do HAST — evita depender do pacote de tipos só para isto. */
type No = {
  type: string;
  tagName?: string;
  value?: string;
  children?: No[];
  properties?: Record<string, unknown>;
};

/**
 * Onde o link automático não entra:
 *
 * - `a` — já existe um link ali, escolhido por quem escreveu.
 * - `h1`–`h6` — título linkado fica visualmente sujo e atrapalha a leitura.
 * - `code`, `pre` — texto técnico não deve virar link.
 * - `blockquote` — citação é palavra de outra pessoa; não se mexe.
 */
const PROIBIDOS = new Set([
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "code",
  "pre",
  "script",
  "style",
  "blockquote",
]);

export function rehypeLinksInternos({ paginaAtual }: { paginaAtual?: string } = {}) {
  return (tree: No) => {
    const usados = new Set<string>();

    const visitar = (no: No) => {
      if (!no.children) return;
      if (no.tagName && PROIBIDOS.has(no.tagName)) return;

      const novos: No[] = [];
      for (const filho of no.children) {
        if (filho.type === "text" && typeof filho.value === "string" && usados.size < MAX_LINKS) {
          const trechos = repartirComLinks(filho.value, usados, paginaAtual);
          if (trechos.length === 1 && !trechos[0].href) {
            novos.push(filho);
            continue;
          }
          for (const t of trechos) {
            novos.push(
              t.href
                ? {
                    type: "element",
                    tagName: "a",
                    properties: { href: t.href, "data-link-automatico": "true" },
                    children: [{ type: "text", value: t.texto }],
                  }
                : { type: "text", value: t.texto }
            );
          }
          continue;
        }
        visitar(filho);
        novos.push(filho);
      }
      no.children = novos;
    };

    visitar(tree);
  };
}
