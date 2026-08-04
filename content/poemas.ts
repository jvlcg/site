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
  /**
   * Leitura crítica do poema, escrita para o site.
   *
   * Fica junto do texto, e não num arquivo à parte, por um motivo prático: a
   * análise só existe por causa do poema, e separá-los abriria espaço para
   * uma ficar sem a outra. Um parágrafo por bloco.
   */
  analise?: string[];
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
    analise: [
      "Soneto expandido em cinco quadras de decassílabos, com rimas alternadas (ABAB) mantidas do início ao fim. A forma fixa não é enfeite: num poema para a mãe, o risco é o excesso, e a métrica funciona como contenção — obriga a escolher a palavra que cabe, não a que transborda.",
      "O poema é construído sobre uma oposição que atravessa as cinco estrofes: luz contra escuridão, sol contra bruma, aurora contra inverno. A mãe nunca é descrita fisicamente; ela é sempre o termo luminoso do par. É uma escolha de retórica clássica — definir por contraste em vez de por adjetivo — e é o que impede o texto de cair no retrato sentimental.",
      "A virada está na quarta estrofe, quando a recusa se organiza em lista: nem pompas, nem tesouros, nem glórias, nem lauréis. A acumulação de negativas prepara a única afirmação que interessa, e o verso final da estrofe a entrega como se fosse óbvia. É o mesmo movimento da quinta e última: tudo o mais é sombra, e a filiação é a coisa inteira.",
    ],
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
    analise: [
      "Verso livre, estrofes curtas, sem rima. Depois da fatura clássica de outros poemas do autor, aqui a escolha é oposta — e coerente com o assunto, porque um poema sobre não se deixar formatar dificilmente caberia numa forma fixa.",
      "Abre com um aforismo que reescreve Heráclito: não se encontra a mesma pessoa duas vezes. O detalhe está no complemento — nem quando ela insiste em ser a mesma. A insistência é o que o verso acusa; a mudança acontece de qualquer jeito, e fingir permanência é a única forma de mentira que o poema não perdoa.",
      "O centro é uma escolha declarada entre sangrar e silenciar, e o poema opta pela primeira. Daí a série de imagens de ferida como prova de vida: pele marcada, olhos cansados, alma incendiada. A morte aparece não como fim, mas como testemunha — que encontre o falante vivo, o que desloca o medo do morrer para o medo de já estar morto antes.",
      "O fecho troca a chama pela lembrança da chama, e é aí que o poema se resolve: não pede permanência, pede que reste o registro de uma intensidade. Viver como quem arde, sem pedir licença ao fogo.",
    ],
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
    analise: [
      "O poema mais narrativo do conjunto, e o único em que o falante não é o autor. É um monólogo dramático: alguém em situação de rua fala em primeira pessoa, e o texto se sustenta inteiro na consistência dessa voz — que nunca pede pena nem se explica.",
      "A tese está no terceiro verso, curto e isolado depois de duas linhas longas: eu tenho um nome. Todo o resto do poema é o desenvolvimento dessa afirmação contra um mundo que a nega. A cidade passa por cima; a chuva conhece o rosto melhor que a mãe; a polícia pergunta a origem e recebe os ombros como resposta.",
      "O procedimento dominante é a inversão do sagrado para o urbano: os prédios são altares que recusam preces, os santos estão nas vitrines, as rachaduras do viaduto se contam como salmo. Não é ironia fácil — é a constatação de que a transcendência disponível ali é a que passa pela vidraça de loja.",
      "A estrofe da casa perdida é a única em que o passado aparece, e ela funciona porque é concreta: um cachorro com nome, uma janela com sol, um café que não era favor. A precisão desses três itens faz a perda ter tamanho. Os dois versos finais devolvem a dignidade do começo — quem oferece nome recebe olhar inteiro; quem oferece silêncio, tem o silêncio transformado em abrigo.",
    ],
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
    analise: [
      "Alegoria sustentada do começo ao fim, sem quebrar a metáfora nem explicá-la. O xadrez organiza tudo: peças, relógio, árbitro, placar. O leitor entende que se fala de outra coisa sem que o poema precise dizer qual.",
      "A estrutura é de tríades anafóricas, e cada bloco muda o sujeito: dizem que era amistoso, ninguém viu, todos sabiam, chamaram de. A progressão é o argumento do poema — do que foi dito ao que foi visto, do que era sabido ao que foi renomeado. A quarta tríade é a mais dura, porque nomeia o mecanismo: chamar de estratégia o atalho pelas costas, de mercado o leilão da palavra dada.",
      "O termo técnico zugzwang carrega a estrofe central. É a posição do enxadrista obrigado a jogar quando qualquer lance piora sua situação — e é exatamente o que o poema descreve sem precisar de mais nada. Usar o jargão exato, sem traduzi-lo, confia no leitor.",
      "O fecho recusa o consolo. As duas xícaras frias retomam as duas do primeiro verso, fechando o círculo do tempo passado, e a pergunta final desloca a derrota do jogador para o jogo. Não é lamento — é acusação.",
    ],
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
    analise: [
      "Narrativa em cinco movimentos, com estrutura de conto: aparição, preparação, enfrentamento, luta, desfecho. O verso livre e longo aqui serve à prosa da ação; o poema quer contar, e não cantar.",
      "O urso é a única presença nunca nomeada por aquilo que representa, e essa recusa é o que o mantém eficaz. Ele é sazonal (chega sempre no inverno), progressivo (a cada ano mais perto), e não recua diante do que antes o afastava. A pergunta central — por que justo a minha casa — é a pergunta de quem não escolheu o próprio adversário.",
      "A imagem que fixa o poema são os olhos: poços escuros que não piscam. Poço é profundidade sem fundo visível, e o não piscar retira do animal qualquer traço de hesitação. Contra isso, as armas humanas aparecem como o que são — estampido, carabina, disparos inúteis.",
      "O desfecho é uma vitória que custa o vencedor. O corpo a corpo substitui a arma, e o estrangulamento lento inverte os papéis: o homem passa a fazer ao urso o que o urso fazia ao inverno dele. Os três versos finais são os mais curtos do poema, e a brevidade é o luto. O outono chega, a família está a salvo, e a conjunção final — eu, junto — entrega o preço sem adjetivo nenhum.",
    ],
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
    analise: [
      "Cinco quintilhas de verso longo, com esquema de rimas alternadas frouxo, na tradição do poema erótico-metafísico. O vocabulário é deliberadamente elevado (intangível, secreto labirinto, enigmático nexo) e essa elevação é o que mantém o desejo no campo da contemplação.",
      "O poema constrói o corpo do outro como texto a ser lido: mapear a pele como quem lê um manuscrito. A metáfora é sustentada — há o que a boca completa e a voz recusa, há palavras silenciadas, há gestos insinuados e não mostrados. O desejo aqui é hermenêutico antes de ser físico: quer decifrar.",
      "A quarta estrofe faz a declaração mais precisa do conjunto, e é uma correção do que se esperaria: não é a ternura que guia, mas a sede doce, o prazer da vulnerabilidade. O poema admite que deseja o outro exposto, não o outro confortável — e essa honestidade é o que o separa do lugar-comum romântico.",
      "O último verso recua de propósito. Depois de cinco estrofes de dissolução e entrega, o poema se contenta com o arrepio rente à pele. É a conclusão coerente de um texto que se chama Conquista e nunca conquista nada: o convite sem palavras é tudo o que existe, e o poema é o próprio convite.",
    ],
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
    analise: [
      "Não é poema em versos, e sim prosa poética em quatro parágrafos, com sintaxe deliberadamente arcaizante — a invocação ao leitor benévolo é fórmula da retórica clássica, e o poema a usa para marcar solenidade desde a primeira linha.",
      "A imagem que estrutura o texto é a passagem do frio ao calor: a frialdade do anfiteatro cede ao lume da aurora. Anfiteatro é o espaço da dissecação e também o do espetáculo, e é dele que o texto parte. O diploma como lâmina recém-forjada mantém a metáfora cortante — o instrumento é o mesmo, muda o uso.",
      "O parágrafo central converte o tempo em matéria: o relógio retalha o sono em lâminas, cada compêndio é degrau. A frase que sustenta o texto inteiro é a que diz que a morte fala baixo mas ensina alto — antítese perfeita, e a única declaração da formação médica que o poema faz sem ornamento.",
      "O fecho é uma escolha declarada de verbo. Entre ruína e renascer, escolho o verbo curar: o poema termina no infinitivo, que é a forma da ação sem sujeito nem tempo — e portanto a forma do que se assume como ofício, não como episódio.",
    ],
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
    analise: [
      "Poema de imagem única desdobrada, construído inteiro sobre uma metáfora que se sabe humilde: o sentir como cebola. A escolha do vegetal doméstico contra a grandiloquência do tema é o primeiro acerto — impede o texto de se levar a sério demais.",
      "A metáfora é levada às últimas consequências, e é aí que ela deixa de ser piada. Descascar não revela núcleo: revela mais cebola, até que nada reste além das lágrimas. O poema propõe uma teoria do autoconhecimento sem centro — não há um eu verdadeiro no fundo, só o processo de descascar e o choro que ele produz.",
      "A terceira estrofe amplia com um dado real de horticultura: sem água, a cebola cria camadas mais densas e mais pungentes. O poema usa isso como o que é, uma observação técnica, e deixa o leitor fazer a transposição. O jogo entre concêntricos e excêntricos, quase idênticos no som e opostos no sentido, condensa a ideia toda num verso.",
      "O verso final isolado — há quem não aprecie as cebolas — muda o registro de repente. Depois de três estrofes de introspecção, termina numa constatação social quase seca, com reticências. É o poema admitindo que nem todos têm paciência para esse tipo de gente.",
    ],
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
    analise: [
      "Seis quadras de metro regular e dicção declarativa. É o poema mais convencional do conjunto na forma — e a nota do autor explica por quê: foi escrito com auxílio de IA, treinada nos poemas anteriores dele. O texto é, portanto, também um documento sobre a própria ferramenta que critica.",
      "A construção é sistemática: cada estrofe toma um domínio (trabalho, decisão, vigilância, progresso) e aplica o mesmo movimento — a máquina substitui, e no lugar do que foi substituído resta abstração. O toque, o calor e a essência se perdem em linhas de código; o humano vira número na rede.",
      "A imagem mais forte é a dos olhos digitais sempre atentos, que transforma vigilância em corpo e prepara o verso seguinte: liberdade como conceito, não como estado. O poema não recorre a distopia futurista — mantém tudo no presente do indicativo, o que é mais desconfortável.",
      "A última estrofe pede equilíbrio em vez de recusa, e essa moderação é o que mais chama atenção num poema com esse título. A ironia envolvente é involuntária e vale registrar: um texto que teme a inteligência fria substituir a humana foi escrito com a ajuda dela, e o autor faz questão de declarar isso em vez de esconder.",
    ],
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
    analise: [
      "O poema mais ambicioso do conjunto em estrutura: define um conceito e depois o examina em três domínios — luto, lembrança, amor — cada um com sua estrofe. É um texto de método, quase ensaístico.",
      "A abertura funciona por deslocamento de provérbio. A saudade como prato que se come quente inverte a expressão feita, e o complemento é o que dá liga: queima os beiços mas não te enche. Alimento que fere e não sacia é a definição inteira, entregue em dois versos.",
      "A estrofe do luto encontra sua imagem mais precisa na afirmação de que nada cura a saudade, mas de tanto doer a dor se torna uma só com a alma. Não é superação: é fusão. E o que resta depois não é alívio, é amargura sem sensação — que é pior.",
      "A estrofe da lembrança traz a formulação que melhor resume o poema: o que resta é o cartão de visitas da memória. A imagem é doméstica e exata — o cartão fica quando a pessoa vai embora. A estrofe do amor troca o registro para o corpo, com a claustrofobia e a prisão perpétua, e o texto termina com a própria palavra partida ao meio, que é o gesto formal mais expressivo do poema.",
    ],
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
    analise: [
      "Prosa poética em blocos curtos, com espaços largos entre eles. O branco da página faz parte do texto: cada afirmação fica sozinha, e o silêncio ao redor é o vazio de que o poema fala.",
      "A operação central é ressignificar o verbo morrer. Aqui morrer não é um evento único, é um acúmulo — morre-se um pouco mais do que ontem, e cada vez que se deixa de dizer o que se queria. A morte vira sintoma de omissão, e não de fim.",
      "O paradoxo que sustenta o texto está no abraço do vazio: frio, mas o mais aquecido que já se recebera na vida. É um oxímoro que diz muito sobre quem fala — não é que o vazio conforte, é que nada mais chegou perto.",
      "A frase final quebra a segunda pessoa em que o poema todo se apoiava, e vira ordem: pare de morrer. Depois de cinco blocos de constatação, aparece o único imperativo do texto, e as reticências que o seguem tiram dele a certeza. É pedido, não comando.",
    ],
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
    analise: [
      "Quatro estrofes de extensão desigual, verso livre, dicção coloquial. A irregularidade é funcional: o poema imita o pensamento de quem faz um balanço, e balanço não tem métrica.",
      "A obsessão com o último organiza a primeira estrofe — o último suspiro, o último sonho, o último beijo — e instala a ideia de que os fins acontecem sem aviso. A segunda estrofe vira essa mesma atenção para trás, na direção da criança que se foi, e o pedido de desculpas dirigido a ela é o gesto mais delicado do poema.",
      "O trem, que atravessa outros textos do autor, reaparece: só não sabia que era tão veloz. Na terceira estrofe a estrutura muda — as perguntas se acumulam com o mesmo será?, e a repetição transforma projeto em dúvida.",
      "A quarta estrofe abandona a sintaxe e vira lista: pílulas, livros, caminhos, dúvidas, pressão, razão. A ausência de vírgulas acelera o verso e é o momento em que o poema mais se desorganiza — de propósito. O fecho enumera perdas em série e termina no que o título anunciava, com a libertação e a escrita colocadas no mesmo gesto.",
    ],
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
    analise: [
      "Monólogo diante do espelho, em bloco único, com a segunda pessoa dirigida à própria imagem. A cisão é o assunto e também a forma: quem fala e quem é olhado são gramaticalmente distintos do primeiro verso ao último.",
      "A abertura finge inventário físico — barba, calvície, olheira — para descartá-lo em seguida. O poema usa a lista de sinais de envelhecimento como isca, e a nega para chegar ao que interessa: não é o rosto que mudou, é o reconhecimento que se perdeu.",
      "A imagem central é a das cores arrancadas dos olhos. Ela permite o verso mais preciso do texto: mesmo castanhos, me sinto cego. A cor permanece, a visão não — que é a definição exata do que o poema descreve, uma perda invisível de fora.",
      "Dois versos carregam o resto. Hoje sou muitos, menos você condensa a fragmentação num paradoxo aritmético; e a menção à dose por dia, com o por enquanto que a segue, introduz o tratamento sem nomeá-lo e sem confiar nele. O fecho adia o reencontro para depois da morte e pede um minuto de conversa — o que faz do poema inteiro uma tentativa de antecipar essa conversa por escrito.",
    ],
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
    analise: [
      "Alegoria do cacto sustentada em quatro movimentos, com verso livre longo e sintaxe coloquial. O poema conta uma história e a conta em ordem — o que faz dele o mais legível do conjunto, e não por acaso um dos mais completos.",
      "O primeiro movimento estabelece a autoimagem: dureza e perigo como cartão de visita. A comparação entre água e amor no deserto — muitos procurando, poucos para compartilhar — é o tipo de verso que parece simples e carrega a economia inteira do poema.",
      "O segundo movimento é onde está o achado do texto: os espinhos falam. Não são só defesa, são conselho, e o conselho é pessimista — depois da última chuva nunca mais cairá outra gota. O poema identifica com precisão o mecanismo pelo qual a couraça se justifica sozinha, prevendo a seca que garante a própria necessidade.",
      "O desfecho recusa a resolução fácil. A chuva chega, os espinhos amolecem — e aparece o risco novo: um cacto com água demais se afoga. Que o poema escolha dançar em vez de se proteger, e que aceite o afogamento como preço, é o que o separa do final feliz. O deserto deixará de existir não é promessa de segurança; é aceitação de que a paisagem inteira vai mudar.",
    ],
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
    analise: [
      "Poema em bloco único, sem estrofes, escrito como carta. A moldura epistolar — querido papai noel — instala um tom infantil que o texto desmonta verso a verso, e é desse contraste que ele vive.",
      "A oposição estruturante é cristal contra carvão. O cristal é o pedido: puro, frágil, brilhante, que beija os lábios. O carvão é o que se recebe: espalha pó nas roupas amadas, e de sua escuridão surge o medo que enforca. A tradição do carvão como castigo de quem não mereceu presente é usada com precisão — o poema fala de quem se convenceu de não merecer.",
      "O verso sobre o carvão do ano passado que ainda arde é o eixo do texto. Carvão que arde não é castigo inerte, é combustível — e é aí que o poema vira. A maldição dirigida ao Noel vem logo depois, curta e isolada, como quem termina uma discussão.",
      "O fecho converte o castigo em matéria-prima: se a lareira está sempre acesa e do calor nascem os cristais, então o carvão recebido produz o presente que foi negado. Fazer a própria taça e brindar sozinho com os demônios é autossuficiência e solidão na mesma imagem — e o poema não escolhe entre as duas.",
    ],
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
    analise: [
      "O poema mais visual do conjunto. A tipografia é o método: palavras isoladas em caixa alta, versos de uma palavra só, espaços largos entre blocos. É insônia transcrita como diagramação.",
      "O vocativo dirigido aos próprios pensamentos, com o MEUS destacado, estabelece o conflito do texto: o falante disputa a posse do que se passa na própria cabeça. Chamar de meus algo que não obedece é a contradição que o poema não resolve.",
      "O centro é uma fantasia de aniquilação — o estalar de dedos que faz tudo ir embora, com DEDOS isolado antes do resultado. A pergunta que vem depois é a mais inquietante: será eu ou o mundo que tenta constantemente nos substituir. A ambiguidade do nos, que pode incluir os pensamentos ou o leitor, é deixada aberta.",
      "O fecho troca a metafísica pelo corpo. Depois de estalar dedos e substituir mundos, a ordem final é ir dormir porque os dedos doem — provavelmente de escrever. O poema termina se reconhecendo como sintoma daquilo de que fala.",
    ],
  },

  {
    slug: "silencio",
    titulo: "Silêncio",
    data: "4 de agosto de 2020",
    texto: `LAMENTAVEL
Você conseguiu, baixo
Eu, mais baixo.`,
    analise: [
      "Três versos. É o poema mais curto do conjunto e um dos mais eficientes, porque a brevidade é o argumento: um texto sobre silêncio que se estendesse se contradiria.",
      "O LAMENTAVEL isolado em caixa alta e sem acento abre com um veredicto antes de qualquer contexto. A ausência do acento pode ser lapso, mas na página funciona — a palavra chega desarrumada, como julgamento dito no impulso.",
      "A estrutura é de competição descendente. Você conseguiu, baixo estabelece um patamar; Eu, mais baixo o supera pela negativa. A vírgula em cada verso força a pausa e transforma o adjetivo em posição, não em qualidade.",
      "O que o poema não diz é o que ele faz. Não há assunto, não há adversário nomeado, não há causa. Só a constatação de que houve uma disputa por quem chega mais fundo — e que ela foi vencida no pior sentido possível.",
    ],
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
    analise: [
      "Poema com estrutura de canção: refrão, contagens numéricas entre estrofes, dicção falada. As sequências de números funcionam como marcação de compasso — quem lê é forçado a contar, e contar tempo é o assunto do texto.",
      "O verso que abre e retorna — quanto mais penso mais vazio fico — inverte a expectativa de que pensar preencha. É a tese do poema, e o fato de reaparecer no meio da terceira estrofe confirma que o pensamento não avançou.",
      "O trem organiza a metáfora inteira: a estação da vida, o trem perdido, o pai chamado para buscar. O pedido dirigido ao PAI em caixa alta, seguido da menção ao lindo silêncio que não se ouve mais, é o ponto em que o poema deixa de ser sobre tempo e passa a ser sobre ausência — sem que precise dizê-lo.",
      "As contagens invertem antes da última estrofe, de crescente para decrescente, e a estrofe final assume as culpas em série. A autodefinição como filho do medo e irmão da covardia estabelece uma genealogia de afetos, e o desejo final — que o tempo passe mais devagar — é o único pedido que o poema faz, sabendo que não será atendido.",
    ],
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
    analise: [
      "Dois blocos de verso livre com forte trabalho sonoro. É o poema mais experimental do conjunto na superfície da língua, e o que mais depende de ser lido em voz alta.",
      "O terceiro verso é o achado formal: a mesma palavra repetida quatro vezes com maiúsculas migrando de posição. A grafia encena o que descreve — a fuga se acelera e se desorganiza dentro da própria palavra, até virar grito. Nenhuma explicação seria tão eficaz.",
      "A referência a Narciso que perdeu o espelho inverte o mito: sem superfície onde se ver, resta mergulhar. E mergulhar no fundo do próprio ser, num mito que termina em afogamento, carrega o risco sem precisar enunciá-lo.",
      "A segunda estrofe muda para o registro do desperdício, com frases nominais curtas que imitam o esgotamento. O fecho é o momento mais engenhoso: tudo passageiro, inclusive — e o ponto depois de inclusive corta a frase. O Eu isolado no verso seguinte, sem pontuação, chega como o que sobrou. Passageiro, no contexto do trem, é também quem viaja.",
    ],
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
    analise: [
      "Diálogo com a tradição literária brasileira. Severino é o retirante de João Cabral, e o poema assume a dívida no vocativo inicial, tratando-o não como personagem mas como interlocutor vivo.",
      "A construção mais forte está na primeira estrofe: os que estão à margem não dos rios, mas do desespero. A frase reaproveita a geografia do poema de origem e a desloca para o campo moral, num único enjambement.",
      "A segunda estrofe formula o paradoxo que sustenta o texto — o desespero que gera vida. E a terceira mantém o rio como agente ambíguo: mesmo sujo, salva. O irmão que não tem nada para odiar não é elogio à resignação; é constatação de que a pobreza extrema retira até o objeto do ódio.",
      "A virada é o eu. Depois de três estrofes sobre Severino, o falante se coloca vagando moribundo, e confessa o que o título anuncia: odeia odiar. O que ele inveja não é a condição do outro, é a capacidade de seguir caminhando sem que ninguém estenda a mão. O poema termina admitindo que o ódio é dele, e que a admiração é o que o torna insuportável.",
    ],
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

/** Um poema pelo endereço. `undefined` se o slug não existir. */
export function getPoema(slug: string): Poema | undefined {
  return POEMAS.find((p) => p.slug === slug);
}

/**
 * Só os poemas que já têm leitura crítica escrita.
 *
 * São esses que ganham página própria em `/poemas/<slug>`. Um poema sem
 * análise continua aparecendo na listagem — o que ele não tem é página
 * separada, porque uma página que só repete o que a listagem já mostra é
 * conteúdo duplicado, e o Google trata isso como ruído.
 */
export const POEMAS_COM_ANALISE = POEMAS.filter((p) => (p.analise?.length ?? 0) > 0);

/** Poema anterior e seguinte na ordem da página, entre os que têm análise. */
export function vizinhos(slug: string) {
  const i = POEMAS_COM_ANALISE.findIndex((p) => p.slug === slug);
  if (i === -1) return { anterior: undefined, proximo: undefined };
  return {
    anterior: POEMAS_COM_ANALISE[i - 1],
    proximo: POEMAS_COM_ANALISE[i + 1],
  };
}
