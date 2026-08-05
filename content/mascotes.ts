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

/** O convite para agendar, escrito uma vez e usado pelos dois. */
function agendaDe(quem: string): Missao {
  return {
    conversas: [
      [
        { texto: `Oi! Aqui é o ${quem} 👋`, humor: "aceno" },
        { texto: "Se você chegou até aqui, talvez já esteja pensando em marcar uma consulta." },
        { texto: "Dá para falar com o consultório agora mesmo, pelo WhatsApp." },
      ],
      [
        { texto: "Posso te poupar um passo?", humor: "aceno" },
        { texto: "A agenda não é por formulário — quem responde é gente, no WhatsApp." },
        { texto: "Quer que eu abra a conversa para você?" },
      ],
      [
        { texto: "Uma dúvida rápida:", humor: "aceno" },
        { texto: "Prefere atendimento em Goiânia ou por telemedicina?" },
        { texto: "Os dois começam do mesmo jeito — uma mensagem para o consultório." },
      ],
    ],
    acao: { href: "/agendar", rotulo: "Agendar consulta", externo: true },
  };
}

export const ESTETO: Mascote = {
  nome: "Estetô",
  fecharRotulo: "Fechar mensagem do Estetô",
  propria: {
    conversas: [
      [
        { texto: "Oi! Eu sou o Estetô 👋", humor: "aceno" },
        { texto: "Vi que você está lendo há um tempinho por aqui." },
        { texto: "Quer deixar seu contato direto com o consultório? Sem passar por triagem toda vez." },
      ],
      [
        { texto: "Psiu… posso te contar uma coisa?", humor: "aceno" },
        { texto: "Quem se cadastra recebe os artigos novos e os avisos de agenda antes de irem ao site." },
        { texto: "É rápido, e você escolhe se quer receber ou não." },
      ],
      [
        { texto: "Ei! Gostou do que leu?", humor: "aceno" },
        { texto: "Dá para deixar seus dados uma vez só e falar direto com o consultório depois." },
        { texto: "Quer dar uma olhada em como funciona?" },
      ],
    ],
    acao: { href: "/cadastro", rotulo: "Quero me cadastrar" },
  },
  agenda: agendaDe("Estetô"),
};

export const TERMO: Mascote = {
  nome: "Termô",
  fecharRotulo: "Fechar mensagem do Termô",
  propria: {
    conversas: [
      [
        { texto: "Oi! Eu sou o Termô 🌡️", humor: "aceno" },
        { texto: "Eu meço as coisas por aqui — e tem aula em vídeo explicando o que os números querem dizer." },
        { texto: "Tem material aberto, sem cadastro nenhum. Quer ver?" },
      ],
      [
        { texto: "Posso te mostrar uma coisa?", humor: "aceno" },
        { texto: "O Dr. José Victor grava aulas sobre saúde em linguagem sem jargão." },
        { texto: "As gratuitas são abertas a qualquer pessoa." },
      ],
      [
        { texto: "Ei, gosta de entender o porquê das coisas?", humor: "aceno" },
        { texto: "Tem uma área de cursos aqui no site, com aulas curtas e diretas." },
        { texto: "Dá uma olhada — várias são de graça." },
      ],
    ],
    acao: { href: "/cursos", rotulo: "Ver os cursos" },
  },
  agenda: agendaDe("Termô"),
};
