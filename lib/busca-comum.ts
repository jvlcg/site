/**
 * A parte da busca que roda nos dois lados — e por isso mora sozinha.
 *
 * `lib/indice-busca.ts` monta o índice lendo os artigos do disco, então ele
 * arrasta `node:fs` junto. Importar dali de um componente de cliente derruba
 * o build inteiro: o empacotador tenta levar `node:fs` para o navegador e
 * falha com `UnhandledSchemeError` — foi exatamente o que aconteceu.
 *
 * Aqui não há import nenhum, de propósito. É o que permite ao componente da
 * busca usar as mesmas funções que o servidor usa, sem carregar o mundo.
 */

export type ItemBusca = {
  titulo: string;
  url: string;
  resumo: string;
  /** O rótulo mostrado no resultado — a categoria do artigo, ou o tipo. */
  tipo: string;
  /** O que identifica a página: título, resumo, categoria, tags. Não é exibido. */
  termos: string;
  /**
   * Texto corrido que também casa, mas vale menos.
   *
   * Existe por causa de um resultado ruim de verdade: com o poema inteiro
   * dentro de `termos`, buscar "preço" devolvia o poema "Partida Amistosa" em
   * primeiro lugar — a palavra aparece num verso. Quem digita "preço" num site
   * de médico quer saber quanto custa a consulta.
   *
   * O texto continua valendo (quem lembra de um verso acha o poema), só não
   * disputa de igual para igual com a página que **é sobre** aquilo.
   */
  corpo?: string;
};

/** Tira acentos e caixa: "insônia" e "insonia" têm de achar a mesma coisa. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Ordena por relevância, não por posição no índice.
 *
 * Sem isto, quem digita "insônia" recebe primeiro a página fixa que apenas
 * cita a palavra, e só depois o artigo que trata dela — porque as páginas
 * fixas entram antes no índice. Título vale mais que resumo, e começo de
 * palavra vale mais que meio.
 *
 * Exige **todos** os termos: quem escreve "canabidiol dor" quer os dois
 * assuntos juntos, não a união de tudo que fala de dor com tudo que fala de
 * canabidiol.
 */
export function buscar(itens: ItemBusca[], consulta: string, limite = 12): ItemBusca[] {
  const termos = normalizar(consulta)
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (termos.length === 0) return [];

  const pontuados: { item: ItemBusca; pontos: number }[] = [];

  for (const item of itens) {
    const titulo = normalizar(item.titulo);
    const identidade = normalizar(item.termos);
    const corpo = item.corpo ? normalizar(item.corpo) : "";

    let pontos = 0;
    let serve = true;

    for (const termo of termos) {
      const noTitulo = titulo.includes(termo);
      const naIdentidade = identidade.includes(termo);
      const noCorpo = corpo.includes(termo);

      if (!naIdentidade && !noCorpo) {
        serve = false;
        break;
      }

      if (noTitulo) pontos += 10;
      if (new RegExp(`(^|[^a-z0-9])${escapar(termo)}`).test(titulo)) pontos += 6;
      if (naIdentidade) pontos += 3;
      /*
        O corpo vale um ponto, contra os três da identidade. É o suficiente
        para o poema aparecer quando alguém lembra de um verso, e insuficiente
        para ele passar à frente da página que trata do assunto.
      */
      if (noCorpo) pontos += 1;
    }

    if (serve) pontuados.push({ item, pontos });
  }

  return pontuados
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map((p) => p.item);
}

/** O que a pessoa digita vira regex aqui; um "(" solto quebraria a busca. */
function escapar(termo: string): string {
  return termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
