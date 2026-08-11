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
import { avisosConfigurados, inscreverEmail } from "@/lib/avisos-email";
import { verificarIdentidade } from "@/lib/google-identidade";
import { contaDe, creditarIndicacao, lancar, pontosConfigurados } from "@/lib/pontos";
import { cookies } from "next/headers";
import { emailConfigurado, enviarEmail, modeloCadastro } from "@/lib/enviar-email";
import { whatsappLink } from "@/lib/site-config";

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

  // 6 KB e não 4: o token de identidade do Google sozinho passa de 1 KB, e o
  // limite antigo deixava pouca folga para uma observação longa junto dele.
  const corpo = await corpoLimitado(req, 6_000);
  const resultado = validarFicha(corpo);
  if ("erros" in resultado) return responde({ erros: resultado.erros }, 400);

  /**
   * A marca de e-mail verificado é decidida aqui, nunca pelo navegador.
   *
   * Duas condições, e as duas precisam valer: o token tem de ser mesmo do
   * Google (assinatura conferida em `lib/google-identidade.ts`) e o e-mail
   * dele tem de ser o que veio no formulário. A segunda existe porque a pessoa
   * pode se identificar com uma conta e depois trocar o endereço no campo à
   * mão — nesse caso o endereço gravado não é o que o Google confirmou, e
   * marcar como verificado seria mentir para quem for ler a ficha depois.
   *
   * Token inválido, vencido ou ausente não é erro: a ficha é gravada sem a
   * marca, e o cadastro segue igual. Ninguém deixa de ser atendido porque uma
   * verificação opcional falhou.
   */
  const identidade = await verificarIdentidade(
    (corpo as { credencialGoogle?: unknown })?.credencialGoogle
  );
  if (identidade && identidade.email === resultado.ficha.email) {
    resultado.ficha.emailVerificado = true;
  }

  const ok = await gravarFicha(resultado.ficha);
  if (!ok) return responde({ erro: "Não foi possível gravar agora. Tente de novo." }, 503);

  /*
    A lista de avisos por e-mail é gravada à parte, com chave própria (ver
    lib/avisos-email.ts). Falha aqui não derruba o cadastro: a pessoa se
    inscreveu para ser atendida, e perder isso por causa de um aviso opcional
    seria trocar o essencial pelo acessório.
  */
  if ((corpo as { avisosEmail?: unknown })?.avisosEmail === true && avisosConfigurados()) {
    await inscreverEmail(resultado.ficha.email, resultado.ficha.nome);
  }

  /**
   * Pontos e indicação, depois de a ficha estar gravada.
   *
   * Tudo aqui é acessório: nada nesta seção pode impedir um cadastro. Se o
   * banco de pontos estiver fora do ar, a pessoa se cadastra igual e não fica
   * sabendo de nada — o contrário seria recusar paciente por causa de um
   * placar.
   */
  if (pontosConfigurados()) {
    try {
      await contaDe(resultado.ficha.email, resultado.ficha.nome);
      await lancar(resultado.ficha.email, "cadastroCompleto", undefined, resultado.ficha.nome);

      const codigo = (await cookies()).get("indicacao")?.value;
      if (codigo) {
        await creditarIndicacao(codigo, resultado.ficha.email, resultado.ficha.nome);
      }
    } catch {
      /* placar quebrado nunca derruba cadastro */
    }
  }

  /**
   * Confirmação por e-mail — o último passo, e o mais frágil de propósito.
   *
   * Fica **depois** de tudo e dentro de um `try` que engole qualquer falha,
   * pela mesma regra que vale para os pontos e para a lista de avisos: a
   * pessoa preencheu a ficha para ser atendida. Recusar um cadastro porque um
   * servidor de e-mail está fora do ar seria trocar o essencial pelo
   * acessório.
   *
   * Sem `RESEND_API_KEY` no ambiente, `emailConfigurado()` é falso e nada
   * acontece — nem erro, nem espera. O cadastro segue exatamente como hoje.
   *
   * **Sem `await` bloqueando a resposta?** Não: o `await` fica, e é
   * deliberado. Na Vercel a função pode ser encerrada assim que a resposta
   * sai, e uma promessa solta seria cortada no meio — o e-mail simplesmente
   * não sairia, de forma intermitente e impossível de diagnosticar. Meio
   * segundo a mais na resposta é barato perto de um e-mail que às vezes vem e
   * às vezes não.
   */
  if (emailConfigurado()) {
    try {
      const { html, texto } = modeloCadastro({
        nome: resultado.ficha.nome,
        whatsapp: whatsappLink(),
      });
      await enviarEmail({
        para: resultado.ficha.email,
        assunto: "Cadastro recebido — Dr. José Victor",
        html,
        texto,
      });
    } catch {
      /* e-mail nunca derruba cadastro */
    }
  }

  return responde({ cadastrado: true });
}
