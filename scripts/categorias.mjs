/**
 * A que assunto pertence um artigo.
 *
 * ## Por que isto existe
 *
 * O `sync-soro.mjs` carimbava **uma categoria fixa** em tudo que chegava:
 * `Medicina Endocanabinoide`. O resultado, no site no ar, era um artigo sobre
 * telemedicina, outro sobre check-up e outro sobre dor no treino — os três
 * anunciados ao leitor como se fossem sobre cannabis. Onze dos dezesseis
 * artigos estavam assim.
 *
 * Corrigir os arquivos existentes resolveria o sintoma até o próximo artigo
 * chegar. A causa é a linha que decidia por todos, e é ela que sai daqui.
 *
 * ## Como classifica
 *
 * Contagem de termos, com o título pesando mais que o corpo. Não é um
 * classificador esperto e não precisa ser: os assuntos do consultório são
 * poucos e o vocabulário de cada um é bem marcado — quem fala de insônia diz
 * "sono", quem fala de canabidiol diz "canabidiol".
 *
 * Quando nada pontua, cai em `Clínica médica`, que é a área mais ampla do
 * consultório. Um palpite errado aqui é visível e barato de corrigir à mão;
 * inventar uma categoria nova a cada dúvida seria pior.
 *
 * ## Sobre o nome "cannabis medicinal"
 *
 * É o nome que o site usa na navegação e no endereço da página. "Medicina
 * endocanabinoide" continua correto no texto quando se fala do **sistema**
 * endocanabinoide — a rede biológica —, e é assim que aparece nas páginas de
 * conteúdo. Como rótulo de assunto para o leitor, porém, o termo que ele
 * reconhece é o outro.
 */

/** Termos por categoria. Sem acento e em minúsculas — ver `normalizar`. */
const TERMOS = {
  "Cannabis medicinal": [
    "canabidiol", "cbd", "cannabis", "canabinoide", "canabinoides",
    "endocanabinoide", "thc", "anvisa",
  ],
  Telemedicina: [
    "telemedicina", "teleconsulta", "consulta online", "atendimento online",
    "receita digital", "prescricao digital", "videochamada",
  ],
  Sono: [
    "insonia", "sono", "dormir", "noites", "sonolencia", "higiene do sono",
  ],
  "Check-up e prevenção": [
    "check-up", "checkup", "rastreamento", "prevencao", "exames de rotina",
    "medicina preventiva",
  ],
  "Medicina esportiva": [
    "medicina esportiva", "treino", "treinar", "exercicio", "lesao",
    "atleta", "performance", "retorno ao esporte",
  ],
  "Dor crônica": [
    "dor cronica", "fibromialgia", "dor persistente", "analgesia",
    "tratamento da dor",
  ],
  /*
    Só termos que **nomeiam** esta área — nada de vocabulário clínico genérico.

    A primeira versão trazia aqui "consulta", "acompanhamento", "prevenção" e
    "check-up". Como toda página de médico repete essas palavras dezenas de
    vezes, esta categoria vencia as específicas por volume: telemedicina e
    check-up caíam em "Clínica médica". Testado contra os dezesseis artigos,
    eram quatro erros — e nenhum deles em artigo ambíguo.

    A categoria mais ampla é para onde vai quem não deu sinal nenhum. Se ela
    também disputar o sinal dos outros, deixa de ser reserva e vira ímã.
  */
  "Clínica médica": [
    "clinica medica", "medico particular", "clinico geral",
    "medicina interna", "cuidado continuo",
  ],
};

/** A categoria de quem não deu sinal — a área mais ampla do consultório. */
export const PADRAO = "Clínica médica";

export const CATEGORIAS = [...Object.keys(TERMOS)];

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function contar(texto, termo) {
  /*
    Fronteira de palavra dos dois lados, senão "sono" casa dentro de
    "sonoridade" e "cbd" dentro de qualquer sigla. Os termos podem ter espaço
    e hífen, então a fronteira é escrita à mão em vez de `\b`.
  */
  const escapado = termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9])${escapado}([^a-z0-9]|$)`, "g");
  return (texto.match(re) ?? []).length;
}

/**
 * @param {string} titulo
 * @param {string} corpo
 * @returns {string} o nome da categoria
 */
export function classificar(titulo, corpo = "") {
  const t = normalizar(titulo);
  const c = normalizar(corpo);

  let melhor = PADRAO;
  let maior = 0;

  for (const [categoria, termos] of Object.entries(TERMOS)) {
    /* O título pesa mais que o corpo: é onde o assunto está declarado. */
    const pontos = termos.reduce(
      (soma, termo) => soma + contar(t, termo) * 5 + contar(c, termo),
      0
    );
    if (pontos > maior) {
      maior = pontos;
      melhor = categoria;
    }
  }

  return melhor;
}
