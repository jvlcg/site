/**
 * Os poemas.
 *
 * Ficam aqui, num arquivo só, e não em MDX como os artigos — poema não tem
 * subtítulo, lista nem link; tem verso e silêncio entre versos. O que ele
 * precisa é que a quebra de linha seja respeitada exatamente como foi escrita,
 * e isso um campo de texto simples entrega melhor que qualquer marcação.
 *
 * COMO ADICIONAR UM POEMA
 *
 * Copie um bloco abaixo, cole no começo da lista e troque o conteúdo. A ordem
 * do arquivo é a ordem da página: o primeiro aqui aparece primeiro no site.
 *
 * O texto vai entre crases (`), e não entre aspas. Com crases você pode
 * apertar Enter à vontade dentro do poema, e cada quebra chega ao site como
 * quebra de verso. Com aspas, não funciona.
 *
 * O `slug` é o endereço do poema no site: só letras minúsculas, números e
 * hífen. Sem acento e sem espaço.
 */

export type Poema = {
  /** Endereço na URL: /poemas#<slug> */
  slug: string;
  titulo: string;
  /** Data de escrita, como você quiser mostrar. Opcional. */
  data?: string;
  /** O poema. As quebras de linha são preservadas como estão escritas. */
  texto: string;
  /**
   * Linha de dedicatória, mostrada depois do poema em itálico.
   *
   * É campo separado do texto de propósito: "Feliz dia das mães, eu te amo"
   * não é verso, é recado. Junto com o poema, quebraria a métrica que o resto
   * mantém; à parte, continua sendo lido — e se lê como o que é.
   */
  dedicatoria?: string;
};

export const POEMAS: Poema[] = [
  {
    slug: "raios-de-sol",
    titulo: "Raios de sol",
    data: "10 de maio de 2026",
    texto: `Há quem procure em vãs filosofias
A causa do que aquece o coração;
Eu busco a paz das minhas alegrias
Na luz que vence toda a escuridão.

Se o mundo, às vezes, neblina o caminho,
E o tempo traz o inverno e a bruma fria,
Tua presença afasta o desalinho,
E em cada aurora planta a poesia.

É um amor que excede o pensamento,
Que não se explica em regras ou papel;
É o norte firme, é o próprio acalento,
Um rastro de doçura em meio ao fel.

Não peço à vida pompas nem tesouros,
Nem glórias que o destino logo apaga;
Basta-me o Sol, sem lauréis ou louros,
Pois ter teu nome é a maior honraria.

Se sou herdeiro dessa luz constante,
O resto é sombra, o resto é futilidade;
Pois ser teu filho, ó alma radiante,
É minha única e plena dignidade.`,
    dedicatoria: "Feliz dia das mães, eu te amo.",
  },

  {
    slug: "autentico",
    titulo: "Autêntico",
    data: "1º de outubro de 2025",
    texto: `Você não pode encontrar uma pessoa duas vezes,
nem mesmo quando ela insiste em ser a mesma.

Eu me escondia do mundo,
mas nunca consegui me esconder de você.

O tempo sempre me encontra no avesso,
a memória me corta como vidro.
Ainda assim,
prefiro sangrar do que me tornar silêncio.

Que a morte me encontre absurdamente vivo,
sem arrependimento,
com a pele marcada,
os olhos cansados,
mas a alma incendiada.

E se houver algo depois,
que seja apenas a lembrança
de que vivi como quem arde,
sem pedir permissão ao fogo.`,
  },

  {
    slug: "ninguem",
    titulo: "Ninguém",
    data: "outubro de 2025",
    texto: `Concreto é o meu colchão de nuvens gastas.
A cidade passa por cima de mim como uma maré de pneus.
Eu tenho um nome.

A chuva conhece meu rosto melhor que minha mãe.
O vento me chama pelo apelido que não conto pra ninguém.
Carrego sacolas como quem carrega lembranças furadas.

Na marquise, o cobertor tem cheiro de histórias que não acabam.
No bolso, um isqueiro cansado; na boca, o gosto de fuga.
A pedra canta baixo, promete um minuto sem voz na cabeça.
Eu acendo. A noite se abre. Eu caio. O mundo me larga.

A polícia pergunta de onde eu vim; eu respondo com os ombros.
Os prédios são altares que não aceitam minhas preces.
Os santos nas vitrines não me olham, mas escutam meus passos.

Já tive casa. Um cachorro que atendia por “Trovão”.
Uma janela com sol. Um café que não era favor.
Perdi as chaves de tudo, uma por uma, com datas que esqueci.

No viaduto, conto rachaduras como quem aprende um salmo.
Divido pão com pombos, medo de ninguém.
Com fome, não dá pra ter medo.
O estômago grita mais alto que as sirenes.

Às vezes lembro: a risada da escola, o cheiro do feijão no domingo,
um abraço que não queria acabar.

Se alguém me der um nome hoje, eu devolvo com um olhar inteiro.
Se me derem silêncio, eu faço dele um cobertor.`,
  },

  {
    slug: "partida-amistosa",
    titulo: "Partida Amistosa",
    data: "27 de agosto de 2025",
    texto: `Dizem que era amistoso: mesa, relógio, duas xícaras.
Dizem que era amistoso: teu roque cedo, um jogo divertido.
Dizem que era amistoso: minha rainha destemida superava todas as expectativas da mesa.

Ninguém viu o bispo levando a notícia pela diagonal.
Ninguém viu a torre lhe escondendo nas sombras.
Ninguém viu o árbitro folhear regras de olhos fechados.

Todos sabiam do preço do silêncio, pago em peões.
Todos sabiam que a rainha chega quando a vigia cochila.
Todos sabiam: zugzwang — não há mais nada a ser feito.

Chamaram de estratégia o atalho pelas minhas costas.
Chamaram de mercado o leilão da palavra dada.
Chamaram de jogo a conta dividida entre poucos.

Veio o xeque: simples, limpo e dolorido.
É o fim da partida, encarando meu rei derrotado e duas xícaras frias.
No placar, escreveram “mérito”. No fim, ficou a pergunta:
quem perdeu — eu, ou o próprio xadrez?`,
  },

  {
    slug: "o-urso",
    titulo: "O Urso",
    data: "agosto de 2025",
    texto: `Todos os dias, no inverno, eu te vejo entre as árvores.
Um animal selvagem, indomável, que a cada ano se aproxima da minha casa.
À noite, escuto teus grunhidos do lado de fora —
há sussurros neles, pedidos que não ouso repetir.
O frio consome minhas esperanças.

Em preparação, armei-me com tudo que havia para te conter.
Às vezes, o estampido da carabina te afugentava, e bastava.
Mas você ficou mais feroz.
Por que não as outras casas? Por que justo a minha?
Teus olhos — poços escuros — não piscam.

Hoje, darei um fim a você.
Enquanto minha mulher e minha filha brincam no parquinho do quintal,
eu te vejo se aproximando.
Desta vez, armado até os dentes, não recuarei.
Deus, contemple a força da tua criação.

O frio após os disparos inúteis é desesperador.
Você não terá minha família.
O urso monstruoso, mesmo ferido, avança.
Eu, com os ossos fraturados e a moral esmagada, reúno minhas últimas forças.
Agarro teu pescoço e, como uma corda apertada,
vou te estrangulando — lentamente — mesmo ao preço da minha vida.

La vem o outono
Minha família a salvo.
O urso cai. Eu, junto.`,
  },

  {
    slug: "conquista",
    titulo: "Conquista",
    data: "19 de agosto de 2025",
    texto: `Hei de tocar o intangível, o divino,
em tua alma desvendar o mistério oculto;
emaranhar-me em teu ego, secreto labirinto,
cuja entrada é visível, mas a saída é vulto —
e, se consentes, mapear-te a pele como quem lê um manuscrito.

Tenho fome das palavras que silencias,
daqueles gestos teus que não mostras, mas insinuas,
do calor oculto em passos que esfria
quando perto estou, mas que em sonhos perpetuas —
onde tua boca completa o que tua voz recusa.

É em ti que me intriga o sorriso,
um entrelace de olhares que desperta os sentidos;
por ora, contento-me com a lembraça de teu beijo, os sussurros
e o toque de dedos que se encontram sobre neste poema.

Ansiar pela febre das almas confundidas,
deixando a carne ao tempo, à mera transitoriedade;
porque, no fundo, não é a ternura que me guia,
mas a sede doce, prazer da vulnerabilidade —
e o arrepio que te visita quando o sussurro encosta na saudade.

Sentir-te a alma em meus braços entregue,
e assim perder-me em ti, rendido e perplexo;
pois desejar-te não é um querer que se segue,
é dissolver-me inteiro nesse enigmático nexo —
mas, agora, basta o arrepio rente à pele, um convite sem palavras.`,
  },

  {
    slug: "curar",
    titulo: "Curar",
    data: "2025",
    texto: `Leitor benévolo, consente que meu coração, tímido, teça breve digressão sobre o instante em que o saber se converte em hábito de cura.

De súbito, à frialdade do anfiteatro sucede o lume suave da aurora: o diploma fulge como lâmina recém-forjada, e o jaleco, recobre-me os ombros com solenidade quase litúrgica.

Foram seis invernos de vigília, onde o relógio retalhou o sono em lâminas sucessivas; cada suspiro era um compêndio e cada compêndio, um degrau na escarpa da consciência. Entre sombras de anfiteatro e o murmúrio do fim, aprendi que a morte fala baixo mas ensina alto. Fundei-me, então, em ciência e dúvida, enquanto o estertor noturno dos plantões me sussurrava: Persiste.

Eis que hoje ergo, não taça, senão artéria inteiriça transbordante de gratidão. Que o estilete do raciocínio, temperado em ternura, faça do meu ofício ponte entre a agonia e o alívio. Que o pulso, ora graduado em latim e formol, nunca se aparte do silêncio reverente que antecede o diagnóstico.

Assim vencido o século de estudos num só lampejo declaro: entre ruína e renascer, escolho o verbo curar.`,
    dedicatoria: "Texto referente à minha jornada do curso de Medicina.",
  },

  {
    slug: "camadas",
    titulo: "Camadas",
    data: "9 de junho de 2025",
    texto: `Sentir—algo tão estranho,
Tão poderoso e, no entanto, multifacetado.
Cheio de camadas, qual cebola.
E quanto mais descascamos para descobrir seu interior,
Mais cebola encontramos,
até que nada reste,
além das lágrimas.

Uma busca incansável por sentido,
Como se cada camada implorasse por ser revelada,
Todas carregando o amargo gosto do autoconhecimento.

Na ausência de água, as cebolas criam camadas mais densas,
Mais difíceis de descascar e ainda mais pungentes.
Anéis concêntricos—por vezes excêntricos.

Há quem não aprecie as cebolas…`,
  },

  {
    slug: "ecos-de-silicio",
    titulo: "Ecos de Silício",
    data: "2024",
    texto: `Máquinas frias, calculistas,
Em seu despertar, nos consomem.
Promessas de um futuro brilhante,
Mas escondem sombras profundas.

Substituem mãos humanas,
Trabalho transformado em dados.
O toque, o calor, a essência,
Perdem-se nas linhas de código.

Cada decisão calculada,
Sem emoção, sem compaixão.
O humano reduzido a números,
Na vasta rede, uma ilusão.

Vigilância constante, sufocante,
Olhos digitais, sempre atentos.
Liberdade, apenas um conceito,
Numa era de controle e tormentos.

O progresso sem alma avança,
Roubando nossa humanidade.
Em nome da inovação,
Esquecemos a simplicidade.

Que saibamos encontrar o equilíbrio,
Entre a criação e a destruição.
Para que a inteligência fria,
Não se torne nossa perdição.`,
    dedicatoria: "Escrito com banco de dados dos meus poemas prévios. Feito com ChatGPT-4o.",
  },

  {
    slug: "saudade",
    titulo: "Saudade",
    data: "2021",
    texto: `Saudade é um prato que se come quente
Queima os beiços mas não te enche.
Saudade é ultrapassar a barreira,
Entre o consciente e o imaginário
Buscar o inalcançável e alcançar o indesejável.

No luto,
O vazio gélido assola mais uma vez os reprimidos.
Seja por um dia, um mês ou para sempre,
A dor , continuamente, rasga o véu que protege o coração.
Apenas o tempo tende ajudar,
Nada cura a saudade, mas de tanto doer
Sob a melodia das sete trombetas,
A dor se torna uma só com a alma,
E amargurada, não se sente mais nada.

Na lembrança,
A inexperiência e a rapidez mascararam o tic tac
As coisas se passaram tão rápido que não é possível alcançar.
Só no futuro percebes o que perdera e que talvez nunca irá voltar,
Momentos, bens, pessoas, lugares, lembranças
Tudo vai embora, e o que resta é o cartão de visitas da memória, a saudade.
Alguns tendem à nostalgia, outros ao arrependimento.
Mas tudo tende ao mesmo, o sofrimento.

No amor,
O ar esquenta, as mãos ficam inquietas, o peito dói.
Sem fôlego, sente-se claustrofóbico.
A sensação é de estar em uma prisão perpétua,
E todos os dias é um regime de solitária.
Ansie sau
dade`,
  },

  {
    slug: "vazio",
    titulo: "Vazio",
    data: "12 de setembro de 2021",
    texto: `Hoje você morreu um pouco mais do que ontem. Naquela hora, quando deixou de dizer o que queria, você morreu.

E cada vez mais, quanto mais você morre, mais vazio você fica.

Ontem, também, você morreu. Mentiu para si mesmo, tentou enganar o coração e se perdeu. Superar te traz o sopro virtuoso do mundo, te dá a chance de amar novamente!

Totalmente perdido, você tende ao vazio, o vazio lhe abraça.

É um abraço frio, mas foi o mais aquecido que já recebera na vida.

Pare de morrer, seu corpo não suporta mais o vazio…`,
  },

  {
    slug: "o-ultimo-poema",
    titulo: "O último poema",
    data: "11 de setembro de 2021",
    texto: `Engraçado, ontem eu acordei
Não do mesmo jeito que hoje,
De ontem
Só levo saudade dos devaneios.
Não paramos para pensar
Quando vai ser o último,
O último suspiro, o último sonho,
O último beijo.

Eu nasci criança, criança bela e boba.
Não sei o que diria
Para aquela criança, não sei se choro,
Não sei se sorrio ou clamo.
Me desculpe, deixei as coisas passarem.
Só não sabia que o trem era tão veloz.

Daqui pra frente vou mudar, eu sei,
Quando velho, vou questionar
se realmente aproveitei a vida com
Que sonhei, será?
Que lembrarei de quando me tornei homem.
Será? Que conhecerei o verdadeiro amor.
Será? Que me orgulharei de quem eu sou.

Pílulas livros caminhos
Dúvidas pressão razão
Século VIM TIBUM!

Gastei meu dinheiro,
Vendi meus companheiros,
Matei os meus próprios sonhos,
Fiz o meu último poema.
Hoje eu me liberto dos meus demônios…`,
  },

  {
    slug: "eu-nao-sou-voce",
    titulo: "Eu não sou você",
    data: "17 de julho de 2021",
    texto: `Esse espelho.. tenho certeza
algo nele não me agrada.
Seria essa barba? Essa calvície? Essa olheira?
Não, não é isso. Eu não me reconheço mais em você
Algo mudou.
Que saudade que tenho dos meus tempos de menino,
Os olhos castanhos veem a magia no mundo.
Com o entardecer, mudou.
Você conheceu o medo.
Desde então, mesmo criança nunca mais te vi.
Nunca mais enxerguei o mundo daquela maneira
Você arrancou as cores dos meus olhos.
e agora mesmo castanhos, me sinto cego.
Não há um dia que eu não sinta saudades de você.
Hoje sou muitos, menos você.
Uma dose por dia vai resolver o problema, por enquanto.
Espero que quando eu me for, que possamos conversar um com o outro
nem que seja por um minuto
para que eu possa encontrar meu verdadeiro eu.`,
  },

  {
    slug: "espinhos",
    titulo: "Espinhos",
    data: "2021",
    texto: `Eu sou como um cacto,
Dureza e perigo são meu cartão de visita.
Em meio ao deserto me sinto desidratado,
hoje em dia a água é que nem amor!
muitos procurando, mas poucos para compartilhar.

Era assim que eu pensava, vivia a vida com a cara enrugada
minha pele verde refletia meu ódio alheio,
Humor verde, esverdeado, desvairado.

Até que um dia, no deserto mais quente
Fez-se presente uma única nuvem azul,
Era pequena, não demonstrava perigo algum.
Eu petulante, resolvi escutar meus espinhos.
Eles diziam que depois da última chuva, jamais cairia outra gota no deserto.
teria que aprender a viver sob o sol e nada mais.

A nuvem azul se aproximava cada vez mais,
e quando menos esperava, aquela pequena nuvem se tornou uma tempestade.
Nunca estive tão feliz, tanta água!
Meus espinhos se amoleceram, minha pele foi respaldada e minha alma lavada.
Mas esqueci-me de que sou um cacto.
e com tanta água poderia me afogar.
Mas isso não me preocupava mais, eu desejava cada gota daquela nuvem azul.
Para nao me afogar, então, só me restou dançar ao som dos trovões
transpirando ofegante o excesso de água,
Mantendo nossa melodia viva por toda eternidade.
o deserto deixará de existir…`,
  },

  {
    slug: "noel",
    titulo: "Noel",
    data: "11 de dezembro de 2020",
    texto: `Querido papai noel,
De natal desejo um taça de cristal.
Cristal puro, frágil e brilhante, que beija meus lábios enquanto dançamos uma bela canção natalina.
Tocam os sinos, e este seu carvão maldito espalha seu pó em minhas amadas roupas.
De sua ríspida escuridão surge o medo, que enforca e sufoca meus sonhos até sobrarem somente cristais estilhaçados.
O carvão do ano passado ainda arde.
Maldito Noel.
Minha lareira estará sempre acesa.
Do calor, nascem os mais belos cristais.
Farei eu mesmo minha taça, para que eu, sozinho, possa brindar com meus demônios.`,
  },

  {
    slug: "durma",
    titulo: "Durma",
    data: "4 de agosto de 2020",
    texto: `Já chega,
MEUS
Pensamentos

Se o topo é realmente tão alto...

e com um estalar de
DEDOS

Tudo se vai!

Será eu ou o
mundo está
CONSTANTEMENTE

Tentando nos substituir...

Vai dormir, seus dedos
DOEM`,
  },

  {
    slug: "silencio",
    titulo: "Silêncio",
    data: "4 de agosto de 2020",
    texto: `LAMENTAVEL
Você conseguiu, baixo
Eu, mais baixo.`,
  },

  {
    slug: "tempo",
    titulo: "Tempo",
    data: "2018",
    texto: `Quanto mais penso mais vazio fico
O vento frio bate na nuca e me diz
que passou
Realmente passou

1,2,3,4,2,2,3,4

A estação da vida chegou e me deixou
Vazio

Um cálice sem vinho, uma flor
sem espinho
PAI venha me buscar no trem.
Já faz tempo que não ouço seu
lindo silêncio
Tento não pensar, juro
Quanto mais penso mais vazio fico
Nunca o frio passou tão batido
Todo dia eu só penso em poder parar

4,3,2,2,4,3,2,1

A culpa não é minha, perdi o trem para o sul
O tempo foi muito curto, não consegui abraçar
A pessoa que amava também não
estava lá
Somente o vazio consegue me abalar
Mas a chama do amor vem pra segurar
Sou Filho do medo, irmão da covardia
Mas quem sabe um dia
O tempo passe mais devagar.`,
  },

  {
    slug: "passou",
    titulo: "Passou!",
    data: "13 de março de 2017",
    texto: `O silêncio grita como a morte,
Surdo, você.
Foge, FOge, FOGe, FOGE, eu.
Narciso perdeu seu espelho
Mergulho no fundo do meu ser.

Vagões cheios de gente
Tempo perdido.
Tudo em vão.
Desperdício de alegria.
Hoje eu choro mas amanhã passou.
Acho que perdi o meu trem.
Tudo passageiro,
Inclusive.
Eu`,
  },

  {
    slug: "odio",
    titulo: "Ódio",
    data: "11 de janeiro de 2012",
    texto: `Severino, tu és tão grande!
Como o imenso sertão,
Que abrange aqueles que estão à margem,
Não dos rios,
Mas do desespero.

Desespero esse que gera vida,
Mesmo em meio a morte de milhões de severinos, tu encontras a saída.

O Rio, que mesmo sujo salva aquele irmão que não tem nada para odiar.

Eu contudo,
Vagando moribundo.
Olho para ti e odeio odiar,
O ódio me assola.
Pois mesmo sem ninguém lhe estender a mão,
Tu não paras de caminhar.`,
  },

  // ─────────────────────────────────────────────────────────────────
  // MODELO — copie daqui para baixo, cole acima e troque o conteúdo.
  //
  // {
  //   slug: "nome-do-poema",
  //   titulo: "Nome do poema",
  //   data: "2026",
  //   texto: `primeiro verso
  // segundo verso`,
  // },
  // ─────────────────────────────────────────────────────────────────
];
