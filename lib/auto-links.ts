/**
 * Hiperlinks internos automáticos.
 *
 * Sempre que um texto do site cita um assunto que tem página própria — "medicina
 * endocanabinoide", "telemedicina", "check-up" —, a primeira menção vira link
 * para essa página. Vale para os artigos já publicados e, principalmente, para
 * os que ainda vão entrar: o artigo novo (inclusive os que chegam sozinhos da
 * Soro) já nasce com os links no lugar, sem ninguém precisar revisar.
 *
 * Por que isso importa, além da conveniência do leitor:
 *
 * - **Google.** Link interno distribui autoridade entre as páginas e ensina ao
 *   buscador qual página responde por qual assunto. Um artigo sobre insônia que
 *   aponta para a página de endocanabinoide reforça as duas.
 * - **Leitura.** Quem chega por um artigo encontra o caminho natural para o
 *   serviço, em vez de ter que procurar no menu.
 *
 * Regras deliberadas (excesso de link atrapalha em vez de ajudar):
 *
 * - **Uma menção por destino, por texto.** A primeira. Repetir o mesmo link
 *   cinco vezes cansa o leitor e o Google trata como spam.
 * - **Teto por texto** (`MAX_LINKS`), para o artigo não virar um campo azul.
 * - **Nunca linka para a página em que o leitor já está.**
 * - **Nunca dentro de títulos, código ou de um link que já existe** — o autor
 *   escolheu aquele destino, e título linkado fica feio.
 */

export type Destino = {
  /** Caminho de destino no site. */
  href: string;
  /**
   * Termos que disparam o link, do mais específico para o mais genérico.
   * A comparação ignora maiúsculas e acentos.
   */
  termos: string[];
};

/** Teto de links inseridos automaticamente por texto. */
export const MAX_LINKS = 6;

export const DESTINOS: Destino[] = [
  {
    href: "/cannabis-medicinal",
    termos: [
      "cannabis medicinal",
      "medicina canabinoide",
      "sistema endocanabinoide",
      "canabidiol",
      "tratamento canabinoide",
      "terapia canabinoide",
    ],
  },
  {
    href: "/clinica-medica",
    termos: [
      "check-up executivo",
      "check-up",
      "checkup",
      "clínica médica",
      "acompanhamento clínico",
      "acompanhamento longitudinal",
    ],
  },
  {
    href: "/medicina-esportiva",
    termos: [
      "medicina esportiva",
      "medicina do esporte",
      "retorno ao esporte",
      "desempenho esportivo",
    ],
  },
  {
    href: "/telemedicina",
    termos: ["telemedicina", "consulta online", "consulta por vídeo", "atendimento a distância"],
  },
  {
    href: "/consultorio",
    termos: ["clínica fisiogyn", "fisiogyn", "consultório em goiânia"],
  },
  {
    href: "/perguntas-frequentes",
    termos: ["perguntas frequentes", "dúvidas frequentes"],
  },
  {
    href: "/sobre",
    termos: ["dr. josé victor lisboa cardoso gomes", "dr. josé victor"],
  },
  {
    href: "/contato",
    termos: ["agendar uma consulta", "agendamento da consulta", "marcar uma consulta"],
  },
  /*
    ────────────────────────────────────────────────────────────────
    Destinos acrescentados quando os links passaram a valer no site
    inteiro, e não só no blog e no FAQ
    ────────────────────────────────────────────────────────────────

    Cada um destes tem página própria e era citado em texto sem nunca virar
    caminho. "Curso" aparecia dezenas de vezes no site e não levava a lugar
    nenhum; quem lia sobre voluntariado não tinha como chegar à página que
    conta o que é.

    Os termos continuam indo **do mais específico para o mais genérico**,
    porque a busca para no primeiro que casa: se "cadastro de pacientes"
    viesse depois de "cadastro", o termo curto venceria sempre e o link mais
    preciso nunca apareceria.
  */
  {
    href: "/cursos",
    termos: [
      "cursos gratuitos",
      "aulas em vídeo",
      "área de cursos",
      "curso online",
      "cursos",
    ],
  },
  {
    href: "/cadastro",
    termos: [
      "cadastro de pacientes",
      "ficha de cadastro",
      "cadastro",
    ],
  },
  {
    href: "/voluntariado",
    termos: [
      "trabalho voluntário",
      "projetos voluntários",
      "voluntariado",
    ],
  },
  {
    href: "/aplicativos",
    termos: [
      "aplicativos recomendados",
      "catálogo de aplicativos",
      "aplicativos",
    ],
  },
  {
    href: "/blog",
    termos: [
      "artigos científicos do blog",
      "artigos do blog",
      "blog",
    ],
  },
  {
    href: "/poemas",
    termos: [
      "poemas autorais",
      "poesia",
      "poemas",
    ],
  },
];

/**
 * Tira acentos e caixa alta para comparar "Endocanabinoide" com "endocanabinóide".
 *
 * A decomposição NFD separa a letra do acento e a remoção do acento devolve a
 * letra sozinha — o texto normalizado tem exatamente o mesmo comprimento do
 * original, o que permite usar as posições encontradas aqui para recortar o
 * texto original sem deslocamento.
 */
const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/**
 * Lista de termos achatada e ordenada do mais longo para o mais curto, para que
 * "check-up executivo" ganhe de "check-up" quando os dois casarem no mesmo ponto.
 */
const TERMOS = DESTINOS.flatMap((d) => d.termos.map((t) => ({ termo: normalizar(t), href: d.href })))
  .sort((a, b) => b.termo.length - a.termo.length);

/** Caractere que pode encostar num termo sem que ele deixe de ser palavra inteira. */
const limite = (c: string | undefined) => c === undefined || !/[\p{L}\p{N}]/u.test(c);

export type Trecho = { texto: string; href?: string };

/**
 * Quebra um texto em trechos, marcando os que devem virar link.
 *
 * `jaUsados` acumula os destinos já linkados e é compartilhado entre as várias
 * chamadas de um mesmo documento — é o que garante uma menção por destino no
 * artigo inteiro, e não por parágrafo.
 */
export function repartirComLinks(
  texto: string,
  jaUsados: Set<string>,
  paginaAtual?: string,
  maximo: number = MAX_LINKS
): Trecho[] {
  if (jaUsados.size >= maximo) return [{ texto }];

  const alvo = normalizar(texto);
  const achados: { inicio: number; fim: number; href: string }[] = [];

  for (const { termo, href } of TERMOS) {
    if (jaUsados.has(href) || href === paginaAtual) continue;

    let de = 0;
    for (;;) {
      const i = alvo.indexOf(termo, de);
      if (i < 0) break;
      const fim = i + termo.length;
      // precisa ser palavra inteira e não pode invadir um trecho já marcado
      if (
        limite(alvo[i - 1]) &&
        limite(alvo[fim]) &&
        !achados.some((a) => i < a.fim && fim > a.inicio)
      ) {
        achados.push({ inicio: i, fim, href });
        jaUsados.add(href);
        break;
      }
      de = i + 1;
    }
    if (jaUsados.size >= maximo) break;
  }

  if (achados.length === 0) return [{ texto }];

  achados.sort((a, b) => a.inicio - b.inicio);
  const trechos: Trecho[] = [];
  let cursor = 0;
  for (const a of achados) {
    if (a.inicio > cursor) trechos.push({ texto: texto.slice(cursor, a.inicio) });
    trechos.push({ texto: texto.slice(a.inicio, a.fim), href: a.href });
    cursor = a.fim;
  }
  if (cursor < texto.length) trechos.push({ texto: texto.slice(cursor) });
  return trechos;
}
