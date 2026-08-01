import {
  CABECALHOS_API,
  corpoLimitado,
  excedeuLimite,
  identifica,
  mesmaOrigem,
} from "@/lib/api-guard";
import {
  COOKIE,
  areaConfigurada,
  bilheteValido,
  cookieDeSessao,
  criarBilhete,
  lerCookie,
  senhaConfere,
} from "@/lib/area-restrita";
import { apagarFicha, cadastroConfigurado, lerFichas } from "@/lib/cadastro";
import { bancoResponde, nomeDaVariavelEncontrada, redisConfigurado } from "@/lib/redis";

/**
 * Área restrita: entrar, listar as fichas e apagar uma ficha.
 *
 * O limite de tentativas de senha é o mais apertado do site — 5 por hora. Senha
 * única é um alvo óbvio para força bruta, e é aqui que estão os dados mais
 * sensíveis que o site guarda.
 */

const LIMITE_LOGIN_HORA = 5;

const responde = (corpo: unknown, status = 200, cookie?: string) =>
  Response.json(corpo, {
    status,
    headers: cookie ? { ...CABECALHOS_API, "Set-Cookie": cookie } : CABECALHOS_API,
  });

const naoEncontrado = () => new Response("Not Found", { status: 404, headers: CABECALHOS_API });

function autenticado(req: Request): boolean {
  return areaConfigurada() && bilheteValido(lerCookie(req, COOKIE));
}

/** Entrar (senha) ou sair (`{ sair: true }`). */
export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return naoEncontrado();
  if (!areaConfigurada()) return responde({ erro: "area nao configurada" }, 503);

  const corpo = (await corpoLimitado(req, 1_000)) as { senha?: unknown; sair?: unknown } | null;

  if (corpo?.sair === true) return responde({ dentro: false }, 200, cookieDeSessao(null));

  const quem = identifica(req);
  if (excedeuLimite(`area:${quem}`, LIMITE_LOGIN_HORA, 60 * 60_000)) {
    return responde({ erro: "Muitas tentativas. Tente de novo daqui a uma hora." }, 429);
  }

  if (typeof corpo?.senha !== "string" || !senhaConfere(corpo.senha)) {
    return responde({ erro: "Senha incorreta." }, 401);
  }

  return responde({ dentro: true }, 200, cookieDeSessao(criarBilhete()));
}

/**
 * Lista as fichas já decifradas, com um diagnóstico da configuração.
 *
 * O diagnóstico existe porque "cadastro indisponível" não diz **qual** peça
 * falta — e falta de chave, banco ausente e banco instalado com outro nome
 * pedem ações completamente diferentes. Fica atrás da senha de propósito: são
 * informações sobre a infraestrutura, e mesmo assim só nomes de variáveis,
 * nunca valores.
 */
export async function GET(req: Request) {
  if (!mesmaOrigem(req)) return naoEncontrado();
  if (!autenticado(req)) return responde({ erro: "nao autorizado" }, 401);

  return responde({
    fichas: await lerFichas(),
    config: {
      chaveDeCriptografia: cadastroConfigurado(),
      bancoConfigurado: redisConfigurado(),
      bancoResponde: await bancoResponde(),
      variavelEncontrada: nomeDaVariavelEncontrada(),
      versao: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    },
  });
}

/** Apaga uma ficha — atende ao direito de exclusão previsto na LGPD. */
export async function DELETE(req: Request) {
  if (!mesmaOrigem(req)) return naoEncontrado();
  if (!autenticado(req)) return responde({ erro: "nao autorizado" }, 401);

  const corpo = (await corpoLimitado(req, 1_000)) as { id?: unknown } | null;
  if (typeof corpo?.id !== "string" || !corpo.id) return responde({ erro: "id ausente" }, 400);

  await apagarFicha(corpo.id);
  return responde({ apagada: true });
}
