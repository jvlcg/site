/**
 * Os cursos.
 *
 * Este arquivo é o catálogo inteiro: o que existe, em que ordem, o que é livre
 * e o que é pago. Nada aqui depende de banco de dados — publicar uma aula é
 * acrescentar um bloco e fazer o commit.
 *
 * ────────────────────────────────────────────────────────────────────
 * COMO PUBLICAR UMA AULA
 * ────────────────────────────────────────────────────────────────────
 *
 * 1. Suba o vídeo no YouTube como **não listado** (livre) ou no serviço de
 *    vídeo protegido (pago). Veja `content/plano-cursos.md`.
 * 2. Copie o identificador do vídeo. No YouTube é o que vem depois de `v=`
 *    em `youtube.com/watch?v=ABC123xyz` — só `ABC123xyz`.
 * 3. Acrescente um bloco de aula no módulo certo, abaixo.
 * 4. Peça o commit. A aula entra no ar na publicação seguinte.
 *
 * ────────────────────────────────────────────────────────────────────
 * OS TRÊS NÍVEIS DE ACESSO
 * ────────────────────────────────────────────────────────────────────
 *
 * `livre`     — qualquer pessoa assiste, sem entrar em nada. É o formato do
 *               conteúdo educativo aberto, e o único que aparece para o Google.
 * `cadastro`  — de graça, mas exige entrar com a conta. Serve quando você quer
 *               saber quem está assistindo, ou liberar as aulas aos poucos —
 *               liberação gradual precisa de uma data de início, e essa data é
 *               a da matrícula.
 * `pago`      — exige entrar e ter a matrícula liberada.
 */

/** De onde vem o vídeo da aula. */
export type Video =
  /**
   * YouTube não listado. Serve bem para conteúdo livre e não custa nada.
   *
   * **Não use em curso pago.** "Não listado" quer dizer fora da busca, não
   * privado: qualquer pessoa com o endereço assiste, e o endereço aparece no
   * código da página para quem souber olhar. Para conteúdo pago existe o tipo
   * `protegido`, abaixo.
   */
  | { tipo: "youtube"; id: string }
  /**
   * Serviço de vídeo com endereço assinado (Panda Video, Bunny, Cloudflare
   * Stream). O identificador aqui é o do vídeo no painel do serviço; quem
   * monta o endereço temporário é o servidor, na hora de exibir.
   */
  | { tipo: "protegido"; id: string };

export type Aula = {
  /** Endereço na URL: /cursos/<curso>/<slug>. Só minúsculas, números e hífen. */
  slug: string;
  titulo: string;
  /** Como "12 min". Aparece na lista de aulas. */
  duracao?: string;
  /** Uma ou duas frases sobre o que a aula cobre. */
  resumo?: string;
  video: Video;
  /**
   * Data de publicação, no formato `2026-08-04`.
   *
   * Sem ela a aula funciona igual — mas **não aparece como vídeo no Google**.
   * A data de publicação é campo obrigatório do `VideoObject`, e dado
   * estruturado incompleto o Google simplesmente descarta. Vale a pena
   * preencher nas aulas gratuitas, que são as que ele indexa.
   */
  publicadaEm?: string;
  /**
   * Capa própria. Sem ela, usa a miniatura que o YouTube já gera.
   *
   * Só vale a pena quando o quadro que o YouTube escolheu ficou ruim.
   */
  capa?: string;
  /**
   * Dias após a matrícula em que a aula abre. Ausente ou `0` = abre na hora.
   *
   * Só tem efeito em curso `cadastro` ou `pago` — liberação gradual precisa de
   * uma data de início por aluno, e é a matrícula que fornece essa data.
   */
  liberaApos?: number;
  /** Material de apoio: PDF, planilha, link. */
  anexos?: { titulo: string; url: string }[];
};

export type Modulo = {
  titulo: string;
  /** Uma frase sobre o módulo. Opcional. */
  resumo?: string;
  aulas: Aula[];
};

export type Curso = {
  /** Endereço na URL: /cursos/<slug>. */
  slug: string;
  titulo: string;
  /** Uma frase, usada no cartão do catálogo e na busca do Google. */
  resumo: string;
  /** Parágrafos da página do curso. */
  descricao: string[];
  acesso: "livre" | "cadastro" | "pago";
  /**
   * Preço em reais. Só em curso `pago`.
   *
   * Aparece na página do curso e entra no QR do PIX. Nunca aparece em página
   * de conteúdo médico — a publicidade médica brasileira veda anunciar preço
   * de consulta, e curso é outra coisa, mas a separação evita confusão.
   */
  preco?: number;
  /** Enquanto `false`, o curso não existe para ninguém — nem no catálogo, nem por URL direta. */
  publicado: boolean;
  /** Para quem é o curso. Vira lista na página. */
  paraQuem?: string[];
  /** "3 h 20 min", "8 aulas". Livre. */
  cargaHoraria?: string;
  modulos: Modulo[];
};

export const CURSOS: Curso[] = [
  // ────────────────────────────────────────────────────────────────
  // MODELO — copie este bloco, cole acima e troque o conteúdo.
  //
  // {
  //   slug: "nome-do-curso",
  //   titulo: "Nome do curso",
  //   resumo: "Uma frase que explica o curso.",
  //   descricao: ["Primeiro parágrafo.", "Segundo parágrafo."],
  //   acesso: "livre",          // "livre" | "cadastro" | "pago"
  //   preco: 149,               // só se for "pago"
  //   publicado: false,         // vire true quando quiser no ar
  //   cargaHoraria: "2 h",
  //   paraQuem: ["Quem tem dor crônica", "Familiares"],
  //   modulos: [
  //     {
  //       titulo: "Módulo 1 — Fundamentos",
  //       aulas: [
  //         {
  //           slug: "aula-1",
  //           titulo: "O que é dor crônica",
  //           duracao: "12 min",
  //           resumo: "A diferença entre dor aguda e crônica.",
  //           video: { tipo: "youtube", id: "COLE_O_ID_AQUI" },
  //           liberaApos: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // ────────────────────────────────────────────────────────────────
];
