/**
 * Trabalho voluntário e projetos comunitários.
 *
 * Fica em arquivo de dados, e não escrito dentro da página, porque esta é a
 * lista que mais vai crescer no site: cada ação nova é um bloco a acrescentar
 * aqui, sem mexer em layout nenhum.
 *
 * COMO ACRESCENTAR
 *
 * Copie um bloco, cole no começo da lista que corresponde (`REALIZADOS` para o
 * que já aconteceu, `PLANEJADOS` para o que ainda vai começar) e troque o
 * conteúdo. A ordem do arquivo é a ordem da página.
 *
 * Quando um projeto planejado sair do papel, mova o bloco de `PLANEJADOS` para
 * `REALIZADOS` e acrescente o `periodo`.
 */

export type Acao = {
  /** Identificador na URL: /voluntariado#<slug> */
  slug: string;
  titulo: string;
  /** Quando aconteceu. Só nos realizados. */
  periodo?: string;
  /** Onde. Instituição, bairro, cidade. */
  local?: string;
  /** O que foi feito, em uma ou duas frases. Sem adjetivo, sem número inventado. */
  texto: string;
};

/**
 * O que já aconteceu.
 *
 * Regra ao escrever qualquer item aqui: descrever a atividade, não elogiar
 * quem a fez. A publicidade médica brasileira (Res. CFM 2.336/2023) proíbe
 * autopromoção, e trabalho voluntário narrado como feito heroico é exatamente
 * o que ela tem em vista. O que a norma permite — e o que interessa a quem lê —
 * é o registro do que foi feito.
 */
export const REALIZADOS: Acao[] = [
  {
    slug: "internato",
    titulo: "Dois anos de internato médico",
    periodo: "2024 — 2025",
    local: "Rede pública de saúde de Goiás, incluindo o Hospital Estadual Dr. Alberto Rassi (HGG)",
    texto:
      "Os dois últimos anos da graduação em Medicina são cumpridos integralmente dentro do serviço, em rodízio pelas grandes áreas — clínica médica, cirurgia, pediatria, ginecologia e obstetrícia, saúde coletiva e urgência. Atendimento à população do SUS, sob supervisão, em regime de plantão.",
  },
  {
    slug: "vacinacao-covid",
    titulo: "Campanha de vacinação contra a COVID-19",
    periodo: "2021",
    local: "Goiânia-GO",
    texto:
      "Atuação voluntária nos postos de imunização durante a campanha, no período em que a vacinação de massa dependia de mão de obra em quantidade maior do que a rede tinha disponível.",
  },
  {
    slug: "extensao-puc",
    titulo: "Projeto comunitário de extensão universitária",
    periodo: "2023",
    local: "PUC Goiás",
    texto:
      "Projeto de extensão voltado à comunidade, premiado em 2º lugar no I Fórum de Extensão do curso de Medicina da PUC-GO.",
  },
  {
    slug: "liga-trauma",
    titulo: "Liga Acadêmica de Cirurgia do Trauma",
    periodo: "2022 — 2024",
    local: "PUC Goiás",
    texto:
      "Direção acadêmica da liga, com organização de eventos de formação e de ações abertas à comunidade.",
  },
];

/**
 * O que ainda vai começar.
 *
 * Esta lista existe para ser honesta sobre o que é intenção. Cada item aqui
 * aparece marcado como **em breve** na página — nada é apresentado como já
 * acontecendo. Anunciar como existente um projeto que ainda não começou seria
 * propaganda, não informação.
 */
export const PLANEJADOS: Acao[] = [
  {
    slug: "orientacao-dor-cronica",
    titulo: "Rodas de orientação sobre dor crônica",
    texto:
      "Encontros abertos e gratuitos sobre o que é dor crônica, o que a piora e quando procurar ajuda — voltados a quem convive com dor há anos sem nunca ter recebido explicação sobre ela.",
  },
  {
    slug: "conteudo-educativo-gratuito",
    titulo: "Material educativo gratuito em vídeo",
    texto:
      "Aulas curtas e gratuitas sobre saúde, em linguagem sem jargão, publicadas aqui no site e abertas a qualquer pessoa, sem cadastro.",
  },
  {
    slug: "acoes-em-comunidade",
    titulo: "Ações de saúde em comunidade",
    texto:
      "Mutirões de orientação e aferição em bairros de Goiânia, em parceria com instituições locais. Formato e datas ainda em definição.",
  },
];
