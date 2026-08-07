import { site } from "./site-config";

/**
 * Assistente de reserva — usado quando não há chave de IA configurada ou se a
 * API falhar. Responde por palavras-chave, com as mesmas regras éticas: nunca
 * orienta clinicamente e sempre conduz ao agendamento.
 */

const EMERGENCIA =
  /dor no peito|falta de ar|desmai|avc|derrame|sangrament|convuls|suic[ií]d|me matar|não aguento mais viver|infarto|emerg[êe]ncia|socorro/i;

const RULES: { match: RegExp; reply: string }[] = [
  {
    match: /agendar|marcar|consulta|hor[áa]rio|agenda|atendimento|vaga/i,
    reply: `O agendamento é feito direto pelo WhatsApp do consultório — o retorno é humano, sem robô de triagem. É só tocar no botão abaixo que já abre a conversa.\n[AGENDAR]`,
  },
  {
    match: /pre[çc]o|valor|quanto custa|honor[áa]rio|custa|pagamento|cart[ãa]o/i,
    reply: `As condições de atendimento são informadas no próprio agendamento, antes de confirmar a consulta — com total transparência. Posso te levar ao WhatsApp para consultar?\n[AGENDAR]`,
  },
  {
    match: /conv[êe]nio|plano de sa[úu]de|unimed|ipasgo|amil|bradesco sa[úu]de/i,
    reply: `O foco do consultório é o atendimento particular, feito diretamente com o médico. Há também atendimento por convênio, conduzido pela secretaria — na página de Contato você encontra esse canal.\n[AGENDAR]`,
  },
  {
    match: /onde fica|endere[çc]o|localiza|como chegar|mapa|estacionament|presencial/i,
    reply: `O consultório fica na ${site.address.clinic}, ${site.address.street}, ${site.address.city}-${site.address.state} (Setor Sul, região central). Você pode ver fotos e o mapa na página do consultório.\n[AGENDAR]`,
  },
  {
    match: /telemedicina|online|v[íi]deo|dist[âa]ncia|remot|outro estado|moro em/i,
    reply: `Sim, há atendimento por telemedicina para todo o Brasil: consulta por vídeo com a mesma profundidade da presencial, e prescrição digital assinada, válida em qualquer farmácia do país.\n[AGENDAR]`,
  },
  {
    match: /canabi|cannabis|cbd|thc|endocanabinoid|[óo]leo|maconha/i,
    reply: `A cannabis medicinal é conduzida com avaliação criteriosa e prescrição dentro das normas da Anvisa e do CFM. Se há indicação para o seu caso, isso só pode ser definido em consulta — a página sobre o tema explica todo o processo.\n[AGENDAR]`,
  },
  {
    match: /cultivo|habeas|judicial|plantio|advogad|processo/i,
    reply: `Quando há indicação clínica bem estabelecida e acompanhamento em curso, é possível emitir um laudo médico fundamentado que pode subsidiar a ação judicial. O papel do médico é estritamente clínico — a condução do processo é do advogado. Podemos conversar sobre isso na consulta.\n[AGENDAR]`,
  },
  {
    match: /check.?up|preventiv|exame de rotina|rastrea/i,
    reply: `O check-up aqui não é um pacote fechado: começa por uma consulta que mapeia seus riscos individuais e, a partir dela, os exames são solicitados de forma direcionada.\n[AGENDAR]`,
  },
  {
    match: /emagrec|peso|obesidad|gordura|dieta/i,
    reply: `O emagrecimento é acompanhado clinicamente, com avaliação metabólica e de hábitos — sem fórmulas milagrosas e sem promessa de resultado. A conduta é sempre individual, definida em consulta.\n[AGENDAR]`,
  },
  {
    match: /ins[ôo]ni|dormir|sono/i,
    reply: `Insônia é um dos motivos frequentes de consulta. Antes de qualquer conduta, é preciso entender a causa — há inclusive um artigo no blog explicando quando investigar. Uma avaliação define o caminho certo para você.\n[AGENDAR]`,
  },
  {
    match: /dor|ansiedad|treino|les[ãa]o|esporte|academia|corrida/i,
    reply: `Esse é um tema que exige avaliação individual — cada caso tem uma origem diferente, e é isso que a consulta investiga. Quer que eu te leve ao WhatsApp para agendar?\n[AGENDAR]`,
  },
  {
    match: /forma[çc][ãa]o|curr[íi]culo|crm|quem [ée]|especialis|forma[dt]o|experi[êe]ncia/i,
    reply: `${site.name} é médico inscrito no ${site.crm}, graduado pela PUC Goiás, com atuação em clínica médica, cannabis medicinal e medicina esportiva. A página "Sobre" traz a trajetória e as publicações científicas.\n[AGENDAR]`,
  },
  {
    match: /crian[çc]a|filho|beb[êe]|pediatr|idade|adolescent/i,
    reply: `O atendimento é a partir de 14 anos, incluindo adultos e idosos. Para crianças menores, o ideal é procurar um pediatra.\n[AGENDAR]`,
  },
  {
    match: /obrigad|valeu|legal|[óo]tim|show|perfeito|entendi/i,
    reply: `Fico à disposição. Quando quiser dar o próximo passo, é só chamar no WhatsApp — o retorno é rápido.\n[AGENDAR]`,
  },
  {
    match: /^(oi|ol[áa]|bom dia|boa tarde|boa noite|e a[íi])/i,
    reply: `Olá! Sou o assistente virtual do consultório do ${site.shortName}. Posso ajudar com dúvidas sobre as áreas de atuação, o consultório em ${site.address.city}, telemedicina e como agendar. O que você gostaria de saber?`,
  },
];

export function fallbackAnswer(text: string): string {
  const q = (text ?? "").trim();

  if (EMERGENCIA.test(q)) {
    return `Se você está passando por uma situação de urgência, não espere: procure o pronto-socorro mais próximo ou ligue **192 (SAMU)**. Para apoio emocional imediato, o **CVV atende no 188**, 24 horas, gratuitamente. Seu cuidado agora é prioridade.`;
  }

  for (const rule of RULES) {
    if (rule.match.test(q)) return rule.reply;
  }

  return `Posso ajudar com informações sobre as áreas de atuação, o consultório em ${site.address.city}, telemedicina e como agendar. Para orientações sobre o seu caso, o caminho certo é uma consulta — quer que eu te leve ao WhatsApp?\n[AGENDAR]`;
}
