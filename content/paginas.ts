/**
 * As páginas fixas do site, com o texto que as descreve.
 *
 * A lista morava dentro de `app/mapa-do-site/page.tsx`. Saiu de lá quando a
 * busca passou a precisar da mesma informação: escrita nos dois lugares, um
 * dia o mapa teria uma página que a busca não acha, ou o contrário — e nada
 * acusaria, porque as duas continuariam funcionando.
 *
 * Ficam de fora as páginas de conta e de fluxo (`/agendar`, `/minha-conta`,
 * `/cancelar-avisos`). Quem chega nelas vem por um botão, não procurando por
 * assunto; num mapa ou numa busca elas só afastariam o que a pessoa quer.
 */
export type PaginaFixa = {
  href: string;
  label: string;
  desc: string;
  grupo: string;
  /**
   * Como o paciente escreve, quando não escreve o nome da página.
   *
   * Ninguém busca "medicina esportiva e performance": busca "dor no joelho".
   * Ninguém busca "perguntas frequentes": busca "quanto custa". Sem estes
   * termos a busca só achava quem já sabia o nome do serviço — medido:
   * "ansiedade" devolvia zero resultado, numa página que trata de ansiedade.
   *
   * **Só entra o que a página realmente cobre.** Levar alguém a uma página
   * que não responde o que ele perguntou é pior do que não achar nada: some a
   * chance de ele tentar de outro jeito.
   */
  busca?: string;
};

export const PAGINAS_FIXAS: PaginaFixa[] = [
  // Atendimento
  { grupo: "Atendimento", href: "/clinica-medica", label: "Clínica Médica e Check-up", desc: "Consultas aprofundadas, prevenção e acompanhamento contínuo.", busca: "emagrecimento diabetes colesterol pressão alta exames de sangue prevenção clínico geral médico geral" },
  { grupo: "Atendimento", href: "/cannabis-medicinal", label: "Cannabis Medicinal", desc: "Avaliação criteriosa, prescrição regulamentada e laudo para cultivo.", busca: "ansiedade insônia dor crônica epilepsia canabidiol cbd óleo receita laudo cultivo habeas corpus anvisa" },
  { grupo: "Atendimento", href: "/medicina-esportiva", label: "Medicina Esportiva e Performance", desc: "Manejo de dor, retorno ao esporte e saúde de quem treina.", busca: "lesão dor no joelho dor nas costas tendinite treino academia corrida atleta voltar a treinar" },
  { grupo: "Atendimento", href: "/telemedicina", label: "Telemedicina", desc: "Consulta por vídeo para todo o Brasil, com prescrição digital.", busca: "consulta online consulta por vídeo receita digital atendimento a distância outro estado" },

  // O consultório
  { grupo: "O consultório", href: "/consultorio", label: "Consultório em Goiânia", desc: "Fotos da estrutura, localização no mapa e como chegar.", busca: "endereço como chegar onde fica setor sul goiânia clínica fisiogyn mapa" },
  { grupo: "O consultório", href: "/sobre", label: "Sobre o médico", desc: "Formação, trajetória de pesquisa e publicações científicas.", busca: "formação currículo lattes crm especialidade experiência quem é o médico" },
  { grupo: "O consultório", href: "/contato", label: "Contato e agendamento", desc: "Canais de atendimento, endereço e mapa.", busca: "whatsapp telefone agendar marcar consulta horário de atendimento falar com a secretária" },
  { grupo: "O consultório", href: "/perguntas-frequentes", label: "Perguntas frequentes", desc: "Respostas sobre consultas, valores, convênios e telemedicina.", busca: "quanto custa preço valor da consulta convênio plano de saúde reembolso primeira consulta retorno" },
  { grupo: "O consultório", href: "/voluntariado", label: "Projetos voluntários", desc: "Trabalho comunitário realizado e iniciativas em preparação." },
  { grupo: "O consultório", href: "/cadastro", label: "Cadastro de pacientes", desc: "Canal digital direto com o consultório e prioridade no retorno.", busca: "criar conta cadastrar-se área do paciente login" },

  // Conteúdo
  { grupo: "Conteúdo", href: "/cursos", label: "Cursos e aulas em vídeo", desc: "Aulas sobre saúde em linguagem sem jargão. Conteúdo gratuito e cursos completos.", busca: "aulas vídeos curso online assistir" },
  { grupo: "Conteúdo", href: "/blog", label: "Blog — educação em saúde", desc: "Textos educativos para pacientes.", busca: "artigos textos educação em saúde ler" },
  { grupo: "Conteúdo", href: "/artigos", label: "Artigos científicos", desc: "Produção científica publicada em periódicos e congressos." },
  { grupo: "Conteúdo", href: "/poemas", label: "Poemas", desc: "Escrita pessoal, com análise literária de cada texto. Sem conteúdo médico." },
  { grupo: "Conteúdo", href: "/aplicativos", label: "Aplicativos", desc: "Aplicativos autorais, indicações para médicos e pacientes, e coisas fora do tema." },

  // Institucional
  { grupo: "Institucional", href: "/politica-de-privacidade", label: "Política de Privacidade", desc: "Tratamento de dados conforme a LGPD.", busca: "lgpd dados pessoais cookies privacidade" },
  { grupo: "Institucional", href: "/termos-dos-cursos", label: "Termos de uso dos cursos", desc: "Acesso, reembolso em 7 dias e uso do conteúdo em vídeo." },
];

/** Os grupos na ordem em que devem aparecer, com as páginas de cada um. */
export const GRUPOS_DE_PAGINAS = [
  "Atendimento",
  "O consultório",
  "Conteúdo",
  "Institucional",
].map((titulo) => ({
  titulo,
  links: PAGINAS_FIXAS.filter((p) => p.grupo === titulo),
}));
