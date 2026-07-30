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
  /** true = aparece só na página /perguntas-frequentes, não no chat. */
  soPagina?: boolean;
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

/**
 * Perguntas adicionais — exibidas apenas na página /perguntas-frequentes.
 * Focadas em buscas reais de cauda longa ("posso...", "preciso de...", "é
 * verdade que..."), formato que buscadores e assistentes de IA citam bem.
 */
export const FAQ_EXTRA: FaqEntry[] = [
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "Preciso de encaminhamento para consultar?",
    a: `Não. O atendimento é particular e você pode agendar diretamente, sem encaminhamento de outro profissional ou autorização prévia.

Se você já está em acompanhamento com outros médicos, é útil levar exames recentes e a lista de medicações em uso — isso enriquece a avaliação e evita repetir exames desnecessariamente.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    q: "O que devo levar na primeira consulta?",
    a: `Leve o que você tiver em mãos:

• **Exames recentes** (laboratoriais e de imagem), mesmo que antigos — a evolução ao longo do tempo importa
• **Lista de medicações** e suplementos em uso, com as doses
• **Relatórios ou receitas** de outros profissionais
• Se possível, um **resumo do que você sente**, desde quando e o que já tentou

Nada disso é obrigatório: se você não tiver nenhum documento, a consulta acontece normalmente.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "Canabidiol (CBD) é liberado no Brasil?",
    a: `Sim, com regras. A **Anvisa regulamenta** produtos à base de canabinoides no Brasil, autorizando a importação e a venda de produtos específicos **mediante prescrição médica**.

O que a legislação não permite é o uso recreativo ou a produção caseira sem autorização judicial.

Na prática, isso significa que existe um caminho legal e seguro — e parte do trabalho do médico é orientar esse processo corretamente, incluindo a documentação exigida.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "O tratamento com canabinoides causa dependência?",
    a: `Depende da composição, da dose e do perfil de cada pessoa — não existe resposta única.

Produtos ricos em **CBD** não têm efeito psicoativo relevante. Já formulações com **THC** exigem critério e monitoramento mais próximos, com análise individual de risco.

Essa avaliação de segurança é parte central da consulta e do acompanhamento: dose inicial baixa, ajuste gradual e reavaliações programadas — inclusive para interromper, se necessário.`,
    cta: true,
  },
  {
    categoria: "Sobre",
    soPagina: true,
    q: "O Dr. José Victor é especialista?",
    a: `Ele é médico regularmente inscrito no **${site.crm}**, graduado pela PUC Goiás com honraria Magna Cum Laude.

As áreas citadas no site — clínica médica, medicina endocanabinoide e medicina esportiva — são **campos de atuação clínica**, não títulos de especialista. Anunciar especialidade exige Registro de Qualificação de Especialista (RQE) no Conselho Federal de Medicina, e o site segue rigorosamente essa distinção.

O que sustenta a prática é a formação continuada e a produção científica: 6 artigos publicados em periódicos, livro, capítulo e trabalhos em congressos, além de atuação como revisor de periódico.`,
    cta: true,
  },
  {
    categoria: "Consultório",
    q: "Atende crianças?",
    a: `O atendimento é a partir de **14 anos**, contemplando adolescentes, adultos e idosos.

Para crianças menores de 14 anos, o ideal é procurar um pediatra, que tem formação específica para essa faixa etária.`,
  },
  {
    categoria: "Agendamento",
    q: "Como funciona o retorno?",
    a: `As consultas de retorno são programadas conforme a necessidade do seu caso — em geral para reavaliar resultados de exames, medir a resposta ao plano terapêutico e ajustar condutas.

O acompanhamento é parte central do método: acompanhar ao longo do tempo permite ver tendências, ajustar o que não funcionou e evitar decisões isoladas.

O agendamento do retorno é feito pelo mesmo canal, no WhatsApp.`,
    cta: true,
  },

  // ---------------- Agendamento (cauda longa) ----------------
  {
    categoria: "Agendamento",
    q: "Posso remarcar ou cancelar a consulta?",
    a: `Sim. Avise pelo WhatsApp com a maior antecedência possível e a consulta é remarcada para outro horário.

O aviso antecipado permite oferecer o horário a outro paciente que esteja esperando — por isso ele importa.`,
    cta: true,
  },
  {
    categoria: "Agendamento",
    soPagina: true,
    q: "Quem responde o WhatsApp?",
    a: `No canal de atendimento particular, quem responde é a equipe direta do consultório — não é robô, nem central de atendimento terceirizada.

Existe um segundo canal, conduzido pela secretaria, para atendimento por convênio. Os dois estão na página de Contato.

Nenhum dos canais faz avaliação clínica por mensagem: a orientação sobre o seu caso acontece na consulta.`,
    cta: true,
  },
  {
    categoria: "Agendamento",
    soPagina: true,
    q: "Emitem recibo e nota fiscal?",
    a: `Sim. É emitido recibo do atendimento particular, com os dados necessários para você solicitar reembolso ao seu plano de saúde ou lançar na declaração de imposto de renda.

As regras e o percentual de reembolso são definidos pelo seu plano — vale conferir com a operadora antes.`,
  },
  {
    categoria: "Agendamento",
    q: "Atendem em caráter de urgência?",
    a: `Não. O consultório trabalha com agendamento e **não é um serviço de urgência ou emergência**.

Se você tem sintomas graves ou de início súbito — dor no peito, falta de ar, perda de força ou fala, desmaio, sangramento importante, febre alta com prostração —, procure um pronto-socorro ou ligue **192 (SAMU)** imediatamente.

Para apoio emocional em situação de crise, o **CVV atende no 188**, 24 horas, gratuitamente.`,
  },

  // ---------------- Consultório (cauda longa) ----------------
  {
    categoria: "Consultório",
    q: "Tem estacionamento no local?",
    a: `A clínica fica no Setor Sul, região central de Goiânia, com estacionamento nas proximidades e vagas na via.

Como é uma área movimentada em horário comercial, vale reservar alguns minutos a mais na sua chegada.`,
  },
  {
    categoria: "Consultório",
    soPagina: true,
    q: "Posso levar um acompanhante?",
    a: `Sim. Você pode vir acompanhado, e em alguns casos isso ajuda bastante — sobretudo quando há histórico longo, muitos medicamentos em uso ou quando o paciente é idoso.

Para adolescentes a partir de 14 anos, a presença de um responsável é recomendada.`,
  },
  {
    categoria: "Consultório",
    soPagina: true,
    q: "O local é acessível para cadeirantes?",
    a: `A clínica fica em um edifício com acesso por elevador. Para necessidades específicas de acessibilidade ou mobilidade, avise no agendamento pelo WhatsApp — assim a recepção pode se organizar para te receber melhor.`,
    cta: true,
  },

  // ---------------- Telemedicina (cauda longa) ----------------
  {
    categoria: "Telemedicina",
    q: "A receita da teleconsulta vale na farmácia?",
    a: `Sim. As prescrições são emitidas com **assinatura digital certificada no padrão ICP-Brasil**, que tem a mesma validade legal da receita em papel assinada à mão.

A farmácia valida o documento pelo código de verificação que acompanha o arquivo. Isso vale em todo o território nacional.

Você recebe o arquivo digital e pode apresentá-lo pelo celular ou impresso.`,
    cta: true,
  },
  {
    categoria: "Telemedicina",
    q: "Preciso instalar algum aplicativo?",
    a: `Não. A consulta acontece por um link de videochamada que abre no próprio navegador do celular ou do computador.

O que você precisa: câmera, microfone, conexão estável e um lugar reservado, onde possa conversar com privacidade.

Se a conexão falhar durante a consulta, o atendimento é retomado — isso é combinado no momento.`,
    cta: true,
  },
  {
    categoria: "Telemedicina",
    q: "Telemedicina serve para o meu caso?",
    a: `Para muitas situações sim: acompanhamento de condições crônicas já em seguimento, revisão de exames, ajuste de medicação, orientação sobre sono, ansiedade e hábitos, e boa parte das consultas de retorno.

Em outras, o exame físico é indispensável — e nesse caso você será orientado com honestidade a buscar avaliação presencial. **A teleconsulta não é usada para substituir um exame necessário.**

Na dúvida, descreva brevemente o seu caso no agendamento: a orientação sobre a modalidade mais adequada vem antes de você confirmar.`,
    cta: true,
  },
  {
    categoria: "Telemedicina",
    soPagina: true,
    q: "A consulta online é sigilosa?",
    a: `Sim. O sigilo médico se aplica integralmente à teleconsulta, exatamente como na consulta presencial — é um dever ético previsto no Código de Ética Médica.

As consultas **não são gravadas**. Os registros do prontuário seguem as mesmas regras de guarda e confidencialidade do atendimento presencial.

Vale você também escolher um ambiente reservado durante a chamada.`,
  },

  // ---------------- Tratamentos (cauda longa) ----------------
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "Quanto tempo leva para ver resultado?",
    a: `Depende inteiramente da condição, do ponto de partida e da resposta individual — e é justamente por isso que **nenhum prazo é prometido aqui**.

O que existe é método: metas definidas junto com você no início, reavaliações programadas e ajuste de conduta quando o resultado não vem.

Desconfie de qualquer promessa de resultado em prazo fixo, na medicina em geral.`,
  },
  {
    categoria: "Tratamentos",
    q: "Vou precisar tomar remédio para sempre?",
    a: `Nem sempre. Algumas condições exigem tratamento contínuo; outras melhoram com mudanças de hábito, sono, alimentação e atividade física, permitindo reduzir ou suspender medicações com segurança.

Essa decisão é sempre clínica e individual, tomada com base em reavaliação — nunca por conta própria. Suspender medicação sem orientação pode ser perigoso.

O objetivo do acompanhamento é usar o mínimo necessário pelo tempo necessário.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "Posso continuar com meu outro médico?",
    a: `Sim, e isso costuma ser desejável. O acompanhamento aqui não substitui nem exclui outros profissionais — cardiologista, endocrinologista, psiquiatra, fisioterapeuta ou qualquer outro que já faça parte do seu cuidado.

Quando útil, é possível emitir relatório para comunicação entre os profissionais. Medicina boa é feita em rede, não em disputa.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    q: "Existe cura pela medicina endocanabinoide?",
    a: `Não é assim que a coisa funciona, e é importante ser direto: **não há promessa de cura**.

O que a literatura descreve, para condições específicas, é possibilidade de melhora de sintomas — com evidência que varia muito de uma condição para outra, sendo mais consistente em algumas e ainda preliminar em outras.

Por isso a avaliação é caso a caso: se a evidência não sustentar a indicação para a sua situação, você vai ouvir isso com clareza, e não uma proposta de tratamento.`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    q: "Faz acompanhamento de emagrecimento?",
    a: `Sim, como parte da clínica médica — com investigação antes de conduta.

Isso significa avaliar o que está por trás: função da tireoide, resistência à insulina, sono, uso de medicações que favorecem ganho de peso, padrão alimentar e nível de atividade física.

O acompanhamento é clínico e longitudinal, integrado a outros profissionais quando indicado. **Não há fórmula, protocolo fechado nem promessa de perda de peso em prazo determinado.**`,
    cta: true,
  },
  {
    categoria: "Tratamentos",
    soPagina: true,
    q: "Preciso parar meus medicamentos antes da consulta?",
    a: `**Não.** Não interrompa nenhuma medicação por conta própria antes da consulta — algumas suspensões abruptas trazem risco real.

Leve a lista completa do que você usa, incluindo doses, suplementos e fitoterápicos. Qualquer ajuste é decidido na avaliação, com você.`,
    cta: true,
  },

  // ---------------- Sobre (cauda longa) ----------------
  {
    categoria: "Sobre",
    q: "Como confiro o registro no CRM?",
    a: `Você pode e deve conferir. O Conselho Federal de Medicina mantém uma consulta pública gratuita em **portal.cfm.org.br**, onde qualquer pessoa verifica a situação de um médico pelo nome ou número de registro.

O registro é **${site.crm}**. A produção científica pode ser conferida de forma independente no Currículo Lattes (CNPq) e no ORCID, ambos linkados no rodapé do site.

Verificar credenciais é um direito seu — e um bom hábito com qualquer profissional de saúde.`,
  },
  {
    categoria: "Sobre",
    soPagina: true,
    q: "Onde vejo as avaliações de outros pacientes?",
    a: `As avaliações ficam no perfil do Google, fora deste site — elas são escritas por pacientes, publicadas em plataforma independente, e não passam por edição do consultório.

Você encontra o link na página inicial e na página de Contato.

Publicar depoimentos de pacientes dentro do próprio site é vedado pelas normas de publicidade médica no Brasil, o que é uma proteção para você: a avaliação em plataforma de terceiros é mais difícil de manipular.`,
  },
  {
    categoria: "Sobre",
    q: "O site dá diagnóstico ou orientação médica?",
    a: `Não, e isso é proposital. Todo o conteúdo aqui — incluindo este FAQ, o blog e o assistente virtual — é **educativo** e não substitui uma consulta.

Diagnóstico exige história clínica, exame físico quando indicado e interpretação de exames no contexto da sua vida. Nada disso pode ser feito por um texto ou por um chat.

Use o conteúdo para entender melhor, formular boas perguntas e decidir procurar avaliação — não para se autodiagnosticar ou se automedicar.`,
  },
];

/** Todas as perguntas (chat + exclusivas da página). */
export const FAQ_COMPLETO: FaqEntry[] = [...FAQ, ...FAQ_EXTRA];

/**
 * Perguntas clicáveis do chat — `soPagina` é o único interruptor.
 * Respostas longas demais para o balão do chat ficam só na página.
 */
export const FAQ_CHAT: FaqEntry[] = FAQ_COMPLETO.filter((f) => !f.soPagina);

export const CATEGORIAS = [
  "Agendamento",
  "Consultório",
  "Telemedicina",
  "Tratamentos",
  "Sobre",
] as const;

/** Texto limpo (sem markdown) — usado no Schema FAQPage e no llms.txt. */
export function plain(a: string) {
  return a.replace(/\*\*/g, "").replace(/\n+/g, " ").replace(/•/g, "·").trim();
}

/** FAQ para o Schema FAQPage (SEO / rich results). */
export function faqForSchema(entries: FaqEntry[] = FAQ_COMPLETO) {
  return entries.map((f) => ({
    question: f.full ?? f.q,
    answer: plain(f.a),
  }));
}
