import { site } from "./site-config";

/**
 * FAQ do assistente virtual — perguntas clicáveis com respostas curadas.
 *
 * Respondidas na hora, sem chamar a IA: são instantâneas, gratuitas e com
 * conteúdo 100% controlado (importante para conformidade com o CFM).
 * O campo de texto livre continua disponível para outras dúvidas.
 */

export type FaqEntry = {
  /** Texto do botão (curto). */
  q: string;
  /** Pergunta completa exibida como fala do visitante. */
  full?: string;
  /** Resposta detalhada. Use \n\n para parágrafos. */
  a: string;
  /** Mostra o botão de agendamento ao final. */
  cta?: boolean;
  categoria: "Agendamento" | "Consultório" | "Telemedicina" | "Tratamentos" | "Sobre";
};

export const FAQ: FaqEntry[] = [
  // ---------------- Agendamento ----------------
  {
    categoria: "Agendamento",
    q: "Como agendar uma consulta?",
    a: `O agendamento é feito diretamente pelo WhatsApp do consultório — sem formulário, sem robô de triagem. Você manda uma mensagem, conversa com quem realmente vai te atender e escolhe o horário.

No primeiro contato, é útil já dizer: se prefere atendimento **presencial em ${site.address.city} ou por telemedicina**, e um resumo breve do motivo da consulta. Isso ajuda a reservar o tempo adequado para o seu caso.

As condições de atendimento são informadas nesse momento, antes de qualquer confirmação.`,
    cta: true,
  },
  {
    categoria: "Agendamento",
    q: "Quanto custa a consulta?",
    a: `Os valores não são divulgados no site — essa é uma orientação das normas de publicidade médica, que evitam que o preço seja usado como atrativo.

O que posso garantir é a transparência: **as condições são informadas no agendamento, pelo WhatsApp, antes de você confirmar qualquer coisa.** Não há surpresa depois.

O atendimento é particular. São emitidos recibos para solicitação de reembolso, conforme as regras do seu plano.`,
    cta: true,
  },
  {
    categoria: "Agendamento",
    q: "Atende por convênio?",
    full: "Vocês atendem por plano de saúde?",
    a: `O foco do consultório é o **atendimento particular**, feito diretamente com o Dr. José Victor — é o formato que permite consultas mais longas e acompanhamento próximo.

Existe também atendimento por convênio, conduzido pela secretaria, com agenda e canal próprios. Você encontra esse contato na página de Contato, na seção "Planos de saúde".

Para o particular, é só usar o botão abaixo.`,
    cta: true,
  },
  {
    categoria: "Agendamento",
    q: "Qual a duração da consulta?",
    a: `A consulta é estruturada para ter o tempo que a investigação exige — sem cronômetro apertado. A primeira consulta costuma ser mais longa, porque inclui histórico completo, revisão de exames, hábitos, sono, atividade física e medicações em uso.

Esse é justamente o diferencial do atendimento particular: **tempo real de escuta**. Diagnóstico bom começa com uma boa anamnese, não com pressa.

O horário exato é combinado no agendamento.`,
    cta: true,
  },

  // ---------------- Consultório ----------------
  {
    categoria: "Consultório",
    q: "Onde fica o consultório?",
    a: `O atendimento presencial acontece na **${site.address.clinic}**, na ${site.address.street} — ${site.address.city}/${site.address.state}, CEP ${site.address.zip}.

É no **Setor Sul**, uma das regiões mais centrais da cidade, com acesso rápido pela Praça Cívica, Setor Oeste e Av. 85. Há estacionamento nas proximidades.

Na página do consultório você vê **fotos reais do espaço** (recepção, sala de espera e consultório) e o mapa com a localização exata.`,
    cta: true,
  },
  {
    categoria: "Consultório",
    q: "Como é a estrutura da clínica?",
    a: `A clínica tem recepção e sala de espera climatizadas, consultórios reservados e estrutura de apoio diagnóstico no mesmo endereço — o que facilita quando algum exame de imagem é necessário.

O ambiente foi pensado para uma espera tranquila, com agenda organizada para reduzir tempo de sala de espera.

Você pode conhecer tudo antes de vir: a página do consultório traz uma galeria com fotos de cada ambiente.`,
    cta: true,
  },

  // ---------------- Telemedicina ----------------
  {
    categoria: "Telemedicina",
    q: "Como funciona a telemedicina?",
    a: `Funciona em quatro passos simples:

**1.** Você agenda pelo WhatsApp e escolhe o horário.
**2.** Antes da consulta, recebe um link seguro de videochamada — basta um celular ou computador com câmera e internet estável.
**3.** A consulta acontece por vídeo, com a mesma profundidade da presencial: anamnese completa, análise de exames e plano explicado com clareza.
**4.** Prescrições, pedidos de exame e atestados são enviados com **assinatura digital certificada (ICP-Brasil)**, válidos em farmácias e laboratórios de todo o Brasil.

A telemedicina é regulamentada pelo Conselho Federal de Medicina e segue os mesmos deveres éticos da consulta presencial, incluindo sigilo.`,
    cta: true,
  },
  {
    categoria: "Telemedicina",
    q: "Moro em outro estado, posso ser atendido?",
    a: `Sim. A teleconsulta tem validade em **todo o território nacional**, então você pode ser atendido de qualquer cidade do Brasil.

A prescrição digital é aceita em farmácias de todo o país, e o acompanhamento pode seguir à distância — inclusive para quem viaja com frequência ou mudou de cidade e quer manter a continuidade do cuidado.

Se em algum momento o seu caso exigir exame físico, você será orientado com honestidade a buscar avaliação presencial.`,
    cta: true,
  },

  // ---------------- Tratamentos ----------------
  {
    categoria: "Tratamentos",
    q: "O que é medicina endocanabinoide?",
    a: `O sistema endocanabinoide é uma rede de sinalização natural do corpo humano, que participa da regulação de **dor, sono, apetite, humor e resposta imune**. Ele existe em todos nós, independentemente de qualquer uso de cannabis.

A medicina endocanabinoide estuda como esse sistema se comporta na saúde e na doença, e em quais situações intervenções sobre ele têm respaldo científico.

Na prática do consultório, isso significa **avaliação criteriosa caso a caso**: analisar indicação, segurança, interações e alternativas já estabelecidas. Quando há indicação, a prescrição segue as normas da Anvisa e do CFM, com acompanhamento e ajustes.

Importante: a existência de estudos sobre um tema não significa indicação automática. Se a evidência não sustentar para o seu caso, você vai ouvir isso com clareza.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    q: "Emite laudo para cultivo domiciliar?",
    full: "Como funciona o laudo para habeas corpus / cultivo?",
    a: `Quando há **indicação clínica bem estabelecida e acompanhamento em curso**, é possível emitir um relatório/laudo médico fundamentado que atesta a necessidade terapêutica.

Esse documento é técnico e serve para **subsidiar uma eventual ação judicial** (habeas corpus preventivo), conduzida pelo advogado do paciente.

O papel do médico aqui é **estritamente clínico**: avaliar, indicar quando pertinente, acompanhar e documentar com rigor. A condução do processo cabe ao advogado e a decisão, ao Poder Judiciário — não há garantia de resultado judicial.

Nenhum laudo é emitido sem avaliação clínica e indicação médica.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    q: "Quais condições são atendidas?",
    a: `O atendimento é de **clínica médica**, de adolescentes (a partir de 14 anos) a idosos. Entre os motivos mais frequentes de consulta estão:

• **Check-up e prevenção** — rastreamento individualizado por risco, não pacote genérico
• **Condições crônicas** — hipertensão, diabetes, distúrbios metabólicos
• **Dor crônica** e dor relacionada ao treino
• **Insônia** e distúrbios do sono
• **Ansiedade**, sempre de forma integrada ao cuidado global
• **Emagrecimento** com acompanhamento clínico
• **Medicina esportiva** — avaliação para treinar com segurança e retorno ao esporte

Para saber se o seu caso se encaixa, o melhor caminho é uma avaliação — cada situação é individual.`,
    cta: true,
  },

  // ---------------- Sobre ----------------
  {
    categoria: "Sobre",
    q: "Quem é o Dr. José Victor?",
    a: `${site.name}, inscrito no **${site.crm}**, é graduado em Medicina pela Pontifícia Universidade Católica de Goiás, com a honraria **Magna Cum Laude** (mérito acadêmico).

Tem produção científica publicada — **6 artigos em periódicos** sobre dor, anestesia e intervenção guiada por imagem, além de livro organizado, capítulo e trabalhos apresentados em congressos. Atua também como revisor de periódico científico e tem certificação **ACLS** (suporte avançado de vida).

Atende em clínica médica, medicina endocanabinoide e medicina esportiva — **áreas de atuação clínica**, não títulos de especialista.

Na página "Sobre" você encontra a trajetória completa, e em "Artigos" a produção científica.`,
    cta: true,
  },
];

export const CATEGORIAS = [
  "Agendamento",
  "Consultório",
  "Telemedicina",
  "Tratamentos",
  "Sobre",
] as const;

/** FAQ resumido para o Schema FAQPage (SEO) — texto sem markdown. */
export function faqForSchema() {
  return FAQ.map((f) => ({
    question: f.full ?? f.q,
    answer: f.a.replace(/\*\*/g, "").replace(/\n+/g, " ").replace(/•/g, "").trim(),
  }));
}
