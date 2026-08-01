import {
  CABECALHOS_API,
  corpoLimitado,
  excedeuLimite,
  excedeuTetoGlobal,
  identifica,
  mesmaOrigem,
} from "@/lib/api-guard";
import {
  armazenamentoConfigurado,
  removerAssinatura,
  salvarAssinatura,
  type Assinatura,
} from "@/lib/assinaturas";

/**
 * Inscrição e cancelamento das notificações do blog.
 *
 * As mesmas barreiras da rota do chat: só responde a chamadas vindas do próprio
 * site, com limite por visitante e teto global. Aqui o risco não é custo de IA —
 * é alguém encher a lista de inscrições com lixo, o que atrasaria todo envio
 * futuro.
 *
 * A rota **não** devolve a lista de inscritos em nenhuma circunstância. Quem
 * precisa dela é o script de envio, que fala direto com o armazenamento usando
 * uma credencial que nunca chega ao navegador.
 */

const LIMITE_MINUTO = 5;
const LIMITE_HORA = 20;

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

/** 404 em vez de 403: nem confirma que a rota existe para quem não é do site. */
const naoEncontrado = () => new Response("Not Found", { status: 404, headers: CABECALHOS_API });

/** Confere que o corpo é mesmo uma inscrição de push, e não qualquer JSON. */
function assinaturaValida(dados: unknown): Assinatura | null {
  if (!dados || typeof dados !== "object") return null;
  const { endpoint, keys } = dados as Record<string, unknown>;
  if (typeof endpoint !== "string" || endpoint.length > 1000) return null;

  // o endereço tem de ser uma URL https de um serviço de push de verdade
  try {
    if (new URL(endpoint).protocol !== "https:") return null;
  } catch {
    return null;
  }

  if (!keys || typeof keys !== "object") return null;
  const { p256dh, auth } = keys as Record<string, unknown>;
  if (typeof p256dh !== "string" || typeof auth !== "string") return null;
  if (p256dh.length > 200 || auth.length > 100) return null;

  return { endpoint, keys: { p256dh, auth } };
}

function barreiras(req: Request): Response | null {
  if (!mesmaOrigem(req)) return naoEncontrado();
  if (!armazenamentoConfigurado()) return naoEncontrado();
  if (excedeuTetoGlobal()) return responde({ erro: "indisponivel" }, 503);

  const quem = identifica(req);
  if (
    excedeuLimite(`push:min:${quem}`, LIMITE_MINUTO, 60_000) ||
    excedeuLimite(`push:hora:${quem}`, LIMITE_HORA, 60 * 60_000)
  ) {
    return responde({ erro: "muitas tentativas" }, 429);
  }
  return null;
}

export async function POST(req: Request) {
  const bloqueio = barreiras(req);
  if (bloqueio) return bloqueio;

  const corpo = await corpoLimitado(req, 2_000);
  const assinatura = assinaturaValida(corpo);
  if (!assinatura) return responde({ erro: "inscricao invalida" }, 400);

  const ok = await salvarAssinatura(assinatura);
  return ok ? responde({ inscrito: true }) : responde({ erro: "falha ao salvar" }, 503);
}

export async function DELETE(req: Request) {
  const bloqueio = barreiras(req);
  if (bloqueio) return bloqueio;

  const corpo = await corpoLimitado(req, 2_000);
  const endpoint = (corpo as { endpoint?: unknown } | null)?.endpoint;
  if (typeof endpoint !== "string" || !endpoint) return responde({ erro: "endpoint ausente" }, 400);

  await removerAssinatura(endpoint);
  // sempre 200: cancelar algo que já não existe não é erro para quem cancelou
  return responde({ inscrito: false });
}
