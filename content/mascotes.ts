import type { Humor } from "@/components/ui/Estetoscopio";

/**
 * O que os mascotes falam.
 *
 * Fica separado do componente porque texto muda muito mais que código: ajustar
 * uma frase não deveria exigir abrir o arquivo que controla temporização,
 * animação e som.
 *
 * ## A regra de tom
 *
 * Nenhuma fala promete resultado, cita tratamento ou fala do caso de quem
 * está lendo. Os dois convidam para uma **página**, nunca para uma conduta —
 * é o que mantém tudo isto dentro da publicidade médica (Res. CFM 2.336/2023)
 * e longe de parecer consulta.
 */

export type Fala = { texto: string; humor?: Humor };

/**
 * Cada mascote tem duas missões, e alterna entre elas a cada aparição.
 *
 * A missão **própria** é o que ele existe para fazer: o Estetô convida ao
 * cadastro, o Termô aos cursos. A missão **agenda** é a que os dois
 * compartilham — marcar consulta, que é o objetivo do site inteiro.
 *
 * Alternar, em vez de sortear entre as duas, garante que ninguém veja três
 * vezes seguidas o mesmo pedido. E significa que quem navega por várias
 * páginas recebe os dois convites, sem que nenhum deles apareça duas vezes
 * antes de o outro aparecer uma.
 */
export type Missao = {
  /** Conversas possíveis. Uma é sorteada por aparição. */
  conversas: Fala[][];
  /** O botão que fecha a conversa. */
  acao: { href: string; rotulo: string; externo?: boolean };
};

export type Mascote = {
  nome: string;
  /** Para o `aria-label` do botão de fechar. */
  fecharRotulo: string;
  propria: Missao;
  agenda: Missao;
};

/**
 * O convite para agendar tem DOIS textos, um por personagem — e não um só
 * reaproveitado.
 *
 * Antes havia uma função `agendaDe(nome)` que devolvia as mesmas três frases
 * para os dois, trocando só o nome no cumprimento. No computador os dois
 * aparecem juntos, e o resultado era o defeito relatado: dois balões lado a
 * lado dizendo a mesma coisa. **Dois personagens que falam igual não são dois
 * personagens** — são um repetido, e a repetição faz o convite parecer anúncio.
 *
 * Agora cada um convida pela sua própria natureza: o Estetô escuta, o Termô
 * mede. Mesmo destino, duas vozes.
 */
const ACAO_AGENDA = { href: "/agendar", rotulo: "Agendar consulta", externo: true } as const;

export const ESTETO: Mascote = {
  nome: "Estetô",
  fecharRotulo: "Fechar mensagem do Estetô",
  propria: {
    conversas: [
      [
        { texto: "Oi! Eu sou o Estetô 👋", humor: "aceno" },
        { texto: "Você está lendo há um tempinho — dá para deixar seu contato registrado e não repetir seus dados a cada vez." },
        { texto: "Leva menos de um minuto, e você escolhe o que quer receber." },
      ],
      [
        { texto: "Psiu… posso te contar uma coisa?", humor: "aceno" },
        { texto: "Quem se cadastra fica sabendo dos artigos novos e das aberturas de agenda antes de irem ao ar." },
        { texto: "E sai da lista quando quiser, num clique." },
      ],
      [
        { texto: "Ei! Gostou do que leu?", humor: "aceno" },
        { texto: "O cadastro guarda seus dados uma vez só; da próxima você já fala direto com o consultório." },
        { texto: "Quer ver como funciona?" },
      ],
    ],
    acao: { href: "/cadastro", rotulo: "Quero me cadastrar" },
  },
  /* A voz do Estetô é escutar — é literalmente para isso que ele serve. */
  agenda: {
    conversas: [
      [
        { texto: "Eu sirvo para escutar 🩺", humor: "aceno" },
        { texto: "E quem escuta bastante aprende a reconhecer quem já decidiu, mas segue adiando." },
        { texto: "Do outro lado do WhatsApp tem gente, não robô." },
      ],
      [
        { texto: "Uma pergunta honesta:", humor: "aceno" },
        { texto: "o que te trouxe até aqui já foi respondido, ou ainda ficou alguma dúvida?" },
        { texto: "Se ficou, perguntar ao consultório é mais rápido do que continuar procurando." },
      ],
      [
        { texto: "Posso te poupar um passo?", humor: "aceno" },
        { texto: "Não existe formulário de agenda neste site — é conversa mesmo, no WhatsApp." },
        { texto: "Quer que eu abra?" },
      ],
    ],
    acao: ACAO_AGENDA,
  },
};

export const TERMO: Mascote = {
  nome: "Termô",
  fecharRotulo: "Fechar mensagem do Termô",
  propria: {
    conversas: [
      [
        { texto: "Oi! Eu sou o Termô 🌡️", humor: "aceno" },
        { texto: "Eu meço as coisas por aqui — e o Dr. José Victor grava aulas explicando o que os números do exame querem dizer." },
        { texto: "As gratuitas abrem sem cadastro nenhum. Quer ver?" },
      ],
      [
        { texto: "Posso te mostrar uma coisa?", humor: "aceno" },
        { texto: "Tem aula em vídeo sobre saúde aqui no site, em português de gente — sem jargão." },
        { texto: "São curtas, e várias são de graça." },
      ],
      [
        { texto: "Ei, gosta de entender o porquê das coisas?", humor: "aceno" },
        { texto: "Entender o motivo de um tratamento costuma ser o que faz alguém levar ele até o fim." },
        { texto: "É para isso que serve a área de cursos aqui do site." },
      ],
    ],
    acao: { href: "/cursos", rotulo: "Ver os cursos" },
  },
  /* A voz do Termô é medir — números, tempo, quantidade. */
  agenda: {
    conversas: [
      [
        { texto: "Eu meço as coisas 🌡️", humor: "aceno" },
        { texto: "Se eu medisse o tempo que você já passou lendo sobre isso, ia dar mais que uma consulta." },
        { texto: "Falar com o consultório leva bem menos." },
      ],
      [
        { texto: "Oi! Termô aqui 🌡️", humor: "aceno" },
        { texto: "Marcar é a parte curta: uma mensagem, e a secretaria responde com os horários." },
        { texto: "Em Goiânia ou por telemedicina — você escolhe na conversa." },
      ],
      [
        { texto: "Posso te dar um número?", humor: "aceno" },
        { texto: "Zero. É a quantidade de formulários que você preenche para agendar aqui." },
        { texto: "Começa e termina numa conversa de WhatsApp." },
      ],
    ],
    acao: ACAO_AGENDA,
  },
};
