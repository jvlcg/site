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
  cadastroConfigurado,
  gravarFicha,
  validarFicha,
} from "@/lib/cadastro";

/**
 * Recebe o cadastro de paciente.
 *
 * Rota deliberadamente estreita: só aceita POST, só do próprio site, com limite
 * apertado por visitante — ninguém preenche um cadastro três vezes por minuto,
 * e quem tenta está automatizando.
 *
 * **Não existe GET aqui.** Ler as fichas é assunto da área restrita, que fica em
 * outra rota e exige senha. Manter a leitura fora deste arquivo é o que impede
 * que um erro futuro nas barreiras exponha a lista inteira.
 */

const LIMITE_MINUTO = 3;
const LIMITE_HORA = 8;

const responde = (corpo: unknown, status = 200) =>
  Response.json(corpo, { status, headers: CABECALHOS_API });

export async function POST(req: Request) {
  if (!mesmaOrigem(req)) return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  if (!cadastroConfigurado() || !armazenamentoConfigurado()) {
    return responde({ erro: "cadastro indisponivel" }, 503);
  }
  if (excedeuTetoGlobal()) return responde({ erro: "indisponivel" }, 503);

  const quem = identifica(req);
  if (
    excedeuLimite(`cadastro:min:${quem}`, LIMITE_MINUTO, 60_000) ||
    excedeuLimite(`cadastro:hora:${quem}`, LIMITE_HORA, 60 * 60_000)
  ) {
    return responde({ erro: "Muitas tentativas. Tente novamente daqui a pouco." }, 429);
  }

  const corpo = await corpoLimitado(req, 4_000);
  const resultado = validarFicha(corpo);
  if ("erros" in resultado) return responde({ erros: resultado.erros }, 400);

  const ok = await gravarFicha(resultado.ficha);
  if (!ok) return responde({ erro: "Não foi possível gravar agora. Tente de novo." }, 503);

  return responde({ cadastrado: true });
}
