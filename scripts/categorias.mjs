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

/**
 * Termos por categoria, **escritos como se lê**.
 *
 * A primeira versão os guardava já sem acento, porque é assim que eles são
 * comparados. Funcionava para classificar e estragava as tags: saíam
 * "dor cronica" e "prevencao" no `og:tags`, que é texto que uma pessoa lê.
 * Agora a normalização acontece na comparação, e a forma escrita fica intacta.
 */
const TERMOS = {
  "Cannabis medicinal": [
    "canabidiol", "CBD", "cannabis", "canabinoide", "canabinoides",
    "sistema endocanabinoide", "THC", "Anvisa",
  ],
  Telemedicina: [
    "telemedicina", "teleconsulta", "consulta online", "atendimento online",
    "receita digital", "prescrição digital", "videochamada",
  ],
  /*
    "noites" saiu daqui. É palavra comum em texto corrido — aparecia em artigo
    de check-up e de telemedicina, e entrava nas tags deles como se fossem
    sobre sono.
  */
  Sono: [
    "insônia", "sono", "dormir", "sonolência", "higiene do sono",
  ],
  "Check-up e prevenção": [
    "check-up", "checkup", "rastreamento", "prevenção", "exames de rotina",
    "medicina preventiva",
  ],
  "Medicina esportiva": [
    "medicina esportiva", "treino", "treinar", "exercício", "lesão",
    "atleta", "performance", "retorno ao esporte",
  ],
  "Dor crônica": [
    "dor crônica", "fibromialgia", "dor persistente", "analgesia",
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
    "clínica médica", "médico particular", "clínico geral",
    "medicina interna", "cuidado contínuo",
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
  const escapado = normalizar(termo).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

/**
 * Os assuntos que o artigo realmente menciona, para o `tags:` do frontmatter.
 *
 * ## Por que derivadas, e não escritas
 *
 * Eu as escrevi à mão uma vez, nos dezesseis artigos. O `sync-soro` rodou
 * sozinho na madrugada seguinte e devolveu `tags: []` a onze deles — e estava
 * certo: aqueles arquivos são propriedade do robô, é o que a marca
 * `origem: soro` significa. Anotação à mão em arquivo de máquina dura até a
 * próxima execução.
 *
 * Derivadas do mesmo vocabulário que decide a categoria, elas sobrevivem.
 *
 * Só entram termos que **aparecem com alguma insistência**, e no máximo quatro.
 * Sem o piso, uma menção de passagem virava tag: "sono" entrava em quase todo
 * artigo porque quase todo texto de médico cita sono uma vez. Uma lista de tudo
 * que o artigo tangencia não descreve artigo nenhum.
 *
 * @param {string} titulo
 * @param {string} corpo
 * @returns {string[]}
 */
export function tagsDe(titulo, corpo = "") {
  const t = normalizar(titulo);
  const c = normalizar(corpo);

  const achados = [];
  for (const termos of Object.values(TERMOS)) {
    for (const termo of termos) {
      const peso = contar(t, termo) * 5 + contar(c, termo);
      if (peso > 0) achados.push({ termo, peso });
    }
  }

  return achados
    .filter((a) => a.peso >= 3)
    .sort((a, b) => b.peso - a.peso)
    .slice(0, 4)
    .map((a) => a.termo);
}
