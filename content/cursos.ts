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
 *
 * ────────────────────────────────────────────────────────────────────
 * AS QUATRO COMBINAÇÕES DE TEMPO
 * ────────────────────────────────────────────────────────────────────
 *
 * Dois campos independentes controlam tempo, e cada um responde a uma
 * pergunta diferente. `gratuitoAte` responde "até quando é de graça"; e
 * `acessoPor` responde "por quanto tempo o aluno mantém o curso".
 *
 *   1. GRATUITO PARA SEMPRE
 *      acesso: "livre"
 *      Aberto a qualquer pessoa, sem entrar em nada. É o único formato que
 *      aparece no Google.
 *
 *   2. PAGO, ACESSO VITALÍCIO
 *      acesso: "pago", preco: 149
 *      Quem compra fica com o curso para sempre.
 *
 *   3. GRATUITO POR TEMPO LIMITADO (lançamento)
 *      acesso: "pago", preco: 149, gratuitoAte: "2026-09-30"
 *      Até 30/09 qualquer pessoa entra de graça — com a conta, para a
 *      matrícula existir. Depois disso passa a custar R$ 149. **Quem pegou
 *      durante a janela continua com acesso**, porque a matrícula ficou.
 *
 *   4. PAGO, ACESSO POR TEMPO LIMITADO
 *      acesso: "pago", preco: 149, acessoPor: 365
 *      Um ano de acesso a partir da matrícula de cada aluno.
 *
 * Os dois campos podem andar juntos: um lançamento gratuito que dá um ano de
 * acesso é `gratuitoAte` + `acessoPor`.
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
  /**
   * **Janela de lançamento:** até esta data (`"2026-09-30"`), o curso é
   * gratuito. Depois dela, passa a valer o que `acesso` e `preco` dizem.
   *
   * Durante a janela o curso é grátis **mas exige entrar com a conta**. Isso
   * não é atrito à toa: é o que cria a matrícula — e é a matrícula que garante
   * que **quem pegou de graça continua tendo acesso depois que a janela
   * fecha**. Sem ela, a promessa do lançamento não teria como ser cumprida.
   *
   * Também é o que permite saber quem entrou, que costuma ser o motivo de
   * fazer um lançamento gratuito.
   */
  gratuitoAte?: string;
  /**
   * **Duração do acesso:** dias que o aluno mantém o curso depois de se
   * matricular. Ausente = **acesso vitalício**.
   *
   * `365` para um ano, `180` para seis meses. O relógio começa na matrícula de
   * cada pessoa, não numa data fixa — quem entrou depois tem os mesmos dias
   * que quem entrou antes.
   *
   * Um número aqui precisa aparecer na página de venda antes da compra, e
   * aparece: o cartão do catálogo e a página do curso dizem "acesso por N
   * meses" ou "acesso vitalício". Vender acesso limitado sem dizer é problema
   * de Código de Defesa do Consumidor, não de interface.
   */
  acessoPor?: number;
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
