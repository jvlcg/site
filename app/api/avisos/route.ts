import { CABECALHOS_API, corpoLimitado, excedeuLimite, identifica } from "@/lib/api-guard";
import { avisosConfigurados, cancelarEmail, linkValido } from "@/lib/avisos-email";

/**
 * Cancelamento dos avisos por e-mail.
 *
 * **Só cancela — não inscreve.** A inscrição acontece no cadastro, junto do
 * consentimento explícito. Uma rota aberta de inscrição permitiria colocar o
 * e-mail de outra pessoa numa lista sem que ela soubesse.
 *
 * A exigência de mesma origem não se aplica aqui: quem cancela chega pelo link
 * do e-mail, às vezes por um clique do próprio Gmail, sem passar pelo site. A
 * defesa é a assinatura no link — sem ela bastaria trocar o endereço na URL
 * para descadastrar qualquer pessoa.
 */

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

/**
 * Os dados podem chegar de duas formas, e as duas são legítimas:
 * pelo corpo em JSON, quando a página de cancelamento faz o pedido; ou pela
 * própria URL, no "cancelar em um clique" que o Gmail dispara sozinho, cujo
 * corpo vem em formato de formulário.
 */
async function credenciaisDoPedido(req: Request) {
  const url = new URL(req.url);
  const daUrl = {
    email: url.searchParams.get("e") ?? "",
    assinatura: url.searchParams.get("a") ?? "",
  };
  if (daUrl.email && daUrl.assinatura) return daUrl;

  const corpo = (await corpoLimitado(req, 1_000)) as
    | { email?: unknown; assinatura?: unknown }
    | null;
  return {
    email: typeof corpo?.email === "string" ? corpo.email : "",
    assinatura: typeof corpo?.assinatura === "string" ? corpo.assinatura : "",
  };
}

async function cancelar(req: Request) {
  if (!avisosConfigurados()) return responde({ erro: "indisponivel" }, 503);

  // limite generoso: cancelar é ação legítima e não pode dar trabalho
  if (excedeuLimite(`avisos:${identifica(req)}`, 20, 60 * 60_000)) {
    return responde({ erro: "Muitas tentativas." }, 429);
  }

  const { email, assinatura } = await credenciaisDoPedido(req);
  if (!email || !assinatura || !linkValido(email, assinatura)) {
    return responde({ erro: "Link inválido ou expirado." }, 400);
  }

  await cancelarEmail(email);
  return responde({ cancelado: true });
}

export const POST = cancelar;
export const GET = cancelar;
