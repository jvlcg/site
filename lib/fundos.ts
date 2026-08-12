/**
 * Os fundos animados, um por tipo de página.
 *
 * O tipo mora aqui, e não dentro do `PageHero`, porque duas coisas passaram a
 * usá-lo: o herói padrão e o `FundoDaPagina`, que serve às páginas de herói
 * próprio. Repetir a lista nos dois lugares garantiria que um dia elas
 * divergissem.
 *
 * ## Por que vinte e um, e não onze
 *
 * A primeira versão tinha onze — uma por página do menu. Faltavam as páginas
 * mais numerosas do site: artigo, poema, curso e aula. Somando, mais de
 * cinquenta endereços sem fundo enquanto catorze tinham.
 *
 * E quatro se repetiam: cannabis usava o mesmo da home, aplicativos o mesmo de
 * cursos, voluntariado o mesmo de contato, e a produção científica o mesmo do
 * blog. "Um por página" com repetição não é um por página.
 *
 * Cada movimento foi escolhido pelo assunto — a justificativa de cada um está
 * no bloco de `@keyframes` em `globals.css`, junto do código que o desenha.
 */
export type Fundo =
  | "espiral"
  | "orbita"
  | "mare"
  | "pulso"
  | "varredura"
  | "respiro"
  | "deriva"
  | "ondulacao"
  | "pendulo"
  | "cintila"
  | "convergencia"
  | "germina"
  | "constelacao"
  | "semear"
  | "acolhe"
  | "trilha"
  | "foco"
  | "leitura"
  | "verso"
  | "malha"
  | "acervo";

/**
 * A variação de um fundo dentro da própria família.
 *
 * ## O problema que isto resolve
 *
 * Vinte e um movimentos cobrem vinte e um *tipos* de página — mas quatro
 * desses tipos têm muitos endereços cada. Os dezesseis artigos usavam todos
 * `leitura`; os vinte poemas, todos `verso`; as dezoito aulas, todas `foco`.
 * Somando, cinquenta e seis páginas repartidas em quatro movimentos.
 *
 * Do lado de fora isso é exatamente a queixa que originou o trabalho: quem lê
 * dois artigos seguidos vê o mesmo fundo duas vezes.
 *
 * ## Por que parâmetros, e não cinquenta e seis `@keyframes`
 *
 * Escrever um movimento à mão por endereço só faz sentido quando o movimento
 * diz algo sobre o assunto da página — foi assim que os vinte e um nasceram, e
 * cada um tem a justificativa escrita ao lado. Cinquenta e seis a mais seriam
 * inventados, indistinguíveis entre si, e uma pessoa teria de manter todos.
 *
 * O que muda aqui é o que se percebe sem nomear: de que lado o degradê anda,
 * onde as manchas nascem, quanto tempo o ciclo leva e em que ponto do ciclo a
 * página abre. A família continua reconhecível — artigo lê na horizontal,
 * poema balança na vertical —, e nenhum artigo abre igual a outro.
 *
 * Tudo sai como propriedade personalizada de CSS, então o custo é o mesmo de
 * antes: a animação continua sendo `transform` composto pela GPU, e os
 * degradês, pintados uma vez.
 *
 * A semente é o `slug`, e não um sorteio: o mesmo endereço precisa produzir o
 * mesmo fundo em toda visita e em toda build, senão o servidor e o navegador
 * discordariam na hidratação.
 */
export type VariacaoDeFundo = Record<`--${string}`, string>;

/** FNV-1a e xorshift — pequeno, estável e sem dependência. */
function embaralhar(semente: string) {
  let h = 2166136261;
  for (let i = 0; i < semente.length; i++) {
    h ^= semente.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

/**
 * As páginas de menu, na ordem em que são distribuídas.
 *
 * ## Por que uma lista, e não sorteio
 *
 * Sorteio colide. Semeadas ao acaso, `/` e `/contato` saíram com a mancha
 * quase no mesmo lugar e na mesma cor — capturei as duas lado a lado e são
 * parecidas o bastante para parecerem a mesma página, que é exatamente a
 * queixa que originou este trabalho. Com dezessete páginas e três cores, a
 * chance de duas caírem perto é alta.
 *
 * Estar nesta lista faz a página receber um lugar **reservado** no círculo: a
 * mancha principal nasce num ângulo próprio e a cor dominante gira a cada
 * página.
 *
 * Artigo, poema e aula continuam no sorteio: são dezenas, ninguém os compara
 * lado a lado, e o que importa ali é não repetir o vizinho de leitura.
 */
const PAGINAS_DISTRIBUIDAS = [
  "/",
  "/sobre",
  "/cannabis-medicinal",
  "/clinica-medica",
  "/medicina-esportiva",
  "/telemedicina",
  "/consultorio",
  "/contato",
  "/perguntas-frequentes",
  "/blog",
  "/artigos",
  "/poemas",
  "/cursos",
  "/aplicativos",
  "/voluntariado",
  "/cadastro",
  "/mapa-do-site",
];

export function variacaoDoFundo(semente: string): VariacaoDeFundo {
  const sorte = embaralhar(semente);
  const entre = (min: number, max: number) => min + sorte() * (max - min);

  const ordem = PAGINAS_DISTRIBUIDAS.indexOf(semente);
  if (ordem >= 0) return distribuida(ordem, entre);

  const duracao = Math.round(entre(12, 27));

  return {
    "--fundo-dur": `${duracao}s`,
    /*
      Atraso negativo: a animação já começa adiantada, em vez de esperar. Sem
      isto todo artigo abriria no mesmo quadro do ciclo, que é justamente o
      instante que a pessoa vê ao chegar — o resto do movimento ela nunca
      compara.
    */
    "--fundo-fase": `-${Math.round(entre(0, duracao))}s`,
    /* espelha a camada inteira: inverte o sentido do movimento e a composição */
    "--fundo-espelho": sorte() < 0.5 ? "-1" : "1",
    /* onde nasce cada uma das três manchas, dentro de faixas que preservam o equilíbrio */
    "--fundo-g1x": `${Math.round(entre(8, 34))}%`,
    "--fundo-g1y": `${Math.round(entre(18, 46))}%`,
    "--fundo-g2x": `${Math.round(entre(62, 88))}%`,
    "--fundo-g2y": `${Math.round(entre(10, 38))}%`,
    "--fundo-g3x": `${Math.round(entre(44, 76))}%`,
    "--fundo-g3y": `${Math.round(entre(62, 88))}%`,

    /*
      ---------- E o que faz a diferença ser vista ----------

      Posição sozinha não bastou. Capturei o fundo de oito páginas principais
      lado a lado: as duas primeiras eram praticamente a mesma imagem — mancha
      esverdeada em cima à esquerda, sumindo para a direita. Só o movimento
      mudava, e movimento de vinte segundos não se percebe em quem chega,
      olha e rola a página.

      O que se vê ao trocar de página é o **tamanho** das manchas e **qual cor
      domina**. Uma página de mancha grande e dourada não se confunde com uma
      de mancha pequena e esmeralda, nem que as duas se movam igual.

      As três cores continuam sendo as da marca. O que muda é a proporção
      entre elas — o site continua o mesmo site, cada página com o seu ar.
    */
    "--fundo-r1": `${Math.round(entre(26, 52))}%`,
    "--fundo-r1v": `${Math.round(entre(30, 56))}%`,
    "--fundo-r2": `${Math.round(entre(24, 48))}%`,
    "--fundo-r2v": `${Math.round(entre(26, 50))}%`,
    "--fundo-r3": `${Math.round(entre(28, 54))}%`,
    "--fundo-r3v": `${Math.round(entre(24, 48))}%`,

    /*
      A força de cada cor. As faixas se sobrepõem de propósito: às vezes o
      dourado vence o esmeralda, às vezes some. O piso de 12% evita a página
      onde as três somem e o fundo vira papel branco.
    */
    "--fundo-f1": `${Math.round(entre(18, 46))}%`,
    "--fundo-f2": `${Math.round(entre(14, 42))}%`,
    "--fundo-f3": `${Math.round(entre(12, 38))}%`,
  };
}

/**
 * A variação de uma página de menu — repartida, não sorteada.
 *
 * ## Ângulo áureo, e não fatias iguais
 *
 * A primeira versão punha a página `i` no ângulo `i/total` de uma volta, e eu
 * escrevi no comentário que assim "páginas vizinhas no menu ficam em lados
 * opostos". Era falso: índices consecutivos recebem ângulos consecutivos, que
 * são os mais **parecidos**. E os onze itens do menu são justamente índices
 * seguidos — "Sobre" e "Cannabis" saíam com a mancha a seis pontos de
 * distância, o que ninguém distingue.
 *
 * O ângulo áureo (137,5°) resolve os dois lados de uma vez: cada passo dá
 * quase três oitavos de volta, então vizinhos caem longe, e mesmo assim o
 * conjunto todo se espalha sem deixar buracos. É o mesmo arranjo das sementes
 * de um girassol, pelo mesmo motivo.
 *
 * Medido depois: o par mais parecido entre os onze do menu ficou a oito pontos
 * de distância, e não são vizinhos na navegação.
 *
 * O raio também varia, para as manchas não ficarem todas no mesmo anel. A cor
 * dominante gira de três em três — as três continuam sendo as da marca, muda a
 * proporção.
 */
function distribuida(
  i: number,
  entre: (min: number, max: number) => number
): VariacaoDeFundo {
  const AUREO = 2.399963; /* 137,5° em radianos */
  const volta = i * AUREO;

  /* o raio passeia entre 24% e 36%: mais que isso e a mancha sai pela borda */
  const raio = 24 + ((i * 7) % 13);

  const x = Math.round(50 + Math.cos(volta) * raio);
  const y = Math.round(40 + Math.sin(volta) * raio * 0.8);

  /* as outras duas seguem a principal, defasadas — a composição gira junto */
  const x2 = Math.round(50 + Math.cos(volta + 2.1) * (raio - 2));
  const y2 = Math.round(34 + Math.sin(volta + 2.1) * (raio - 6));
  const x3 = Math.round(50 + Math.cos(volta + 4.2) * (raio - 4));
  const y3 = Math.round(60 + Math.sin(volta + 4.2) * (raio - 4));

  /*
    Qual das três cores manda nesta página.

    O dourado precisa de mais força que as outras duas. Não é capricho: sobre
    o branco do tema claro ele rende muito menos que o esmeralda — capturei
    `/cannabis-medicinal`, que caiu com dourado dominante, e a página saía
    lavada ao lado das vizinhas. Mesma porcentagem, metade da presença.
  */
  const dominante = i % 3;
  const forca = (n: number) => {
    if (n !== dominante) return n === (dominante + 1) % 3 ? 24 : 14;
    return n === 2 ? 64 : 46;
  };

  const duracao = Math.round(entre(11, 22));

  return {
    "--fundo-dur": `${duracao}s`,
    "--fundo-fase": `-${Math.round(entre(0, duracao))}s`,
    "--fundo-espelho": i % 2 === 0 ? "1" : "-1",

    "--fundo-g1x": `${x}%`,
    "--fundo-g1y": `${y}%`,
    "--fundo-g2x": `${x2}%`,
    "--fundo-g2y": `${y2}%`,
    "--fundo-g3x": `${x3}%`,
    "--fundo-g3y": `${y3}%`,

    /* a dominante também é a maior: cor e tamanho apontam para o mesmo lado */
    "--fundo-r1": `${dominante === 0 ? 52 : 32}%`,
    "--fundo-r1v": `${dominante === 0 ? 50 : 34}%`,
    "--fundo-r2": `${dominante === 1 ? 50 : 30}%`,
    "--fundo-r2v": `${dominante === 1 ? 48 : 32}%`,
    "--fundo-r3": `${dominante === 2 ? 54 : 34}%`,
    "--fundo-r3v": `${dominante === 2 ? 46 : 30}%`,

    "--fundo-f1": `${forca(0)}%`,
    "--fundo-f2": `${forca(1)}%`,
    "--fundo-f3": `${forca(2)}%`,
  };
}
