import { NextResponse } from "next/server";
import { donoDoCodigo, pontosConfigurados } from "@/lib/pontos";
import { site } from "@/lib/site-config";

/**
 * O link de indicação: `drjosevictor.com/r/ABC123`.
 *
 * Guarda de quem veio a visita num cookie e manda a pessoa para os cursos. O
 * crédito só acontece se ela se cadastrar — visita não vale ponto, senão
 * bastaria abrir o próprio link mil vezes.
 *
 * ## O cookie
 *
 * Trinta dias, `SameSite=Lax`, sem nada que identifique ninguém: guarda apenas
 * o código de quem indicou. Não é cookie de publicidade e não acompanha a
 * pessoa por outros sites — some quando o cadastro acontece ou quando o prazo
 * vence.
 *
 * `httpOnly` de propósito. Um cookie de indicação legível por script é um
 * cookie que qualquer um reescreve pelo console, atribuindo a si mesmo
 * indicações que não fez.
 *
 * ## Código inválido não é erro
 *
 * Quem chega com um código que não existe — digitado errado, link truncado no
 * WhatsApp — vai para os cursos do mesmo jeito, sem cookie e sem mensagem. A
 * pessoa queria ver o site, não conferir um código; mostrar erro seria punir
 * quem não errou nada.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const { codigo } = await params;
  const destino = new URL("/cursos", site.url);

  const limpo = (codigo ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const valido = limpo.length === 6 && pontosConfigurados() && (await donoDoCodigo(limpo));

  const resposta = NextResponse.redirect(destino, {
    /**
     * 307 e não 301. O redirecionamento permanente ficaria no cache do
     * navegador, e a próxima visita ao mesmo link nem chegaria ao servidor —
     * o cookie não seria renovado, e a indicação se perderia em silêncio.
     */
    status: 307,
  });

  if (valido) {
    resposta.cookies.set("indicacao", limpo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86_400,
    });
  }

  /** Página de passagem: nunca deve aparecer na busca. */
  resposta.headers.set("X-Robots-Tag", "noindex, nofollow");
  return resposta;
}
