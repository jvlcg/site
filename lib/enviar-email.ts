/**
 * Envio de e-mail pelo Resend.
 *
 * Chamada HTTP direta, sem instalar biblioteca: é um `POST` com JSON, e uma
 * dependência a menos é uma dependência a menos para manter e atualizar.
 *
 * Sem `RESEND_API_KEY`, tudo aqui devolve "não enviado" e o robô segue com as
 * notificações do navegador. Um canal não derruba o outro.
 */

export type Email = {
  para: string;
  assunto: string;
  html: string;
  texto: string;
  /** Vai no cabeçalho List-Unsubscribe, que o Gmail transforma em botão nativo. */
  linkCancelar?: string;
};

export const emailConfigurado = () => Boolean(process.env.RESEND_API_KEY);

/** Remetente. Precisa ser de um domínio verificado no Resend. */
const remetente = () => process.env.EMAIL_REMETENTE ?? "avisos@drjosevictor.com";

export async function enviarEmail(e: Email): Promise<{ ok: boolean; erro?: string }> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) return { ok: false, erro: "RESEND_API_KEY ausente" };

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `Dr. José Victor <${remetente()}>`,
        to: [e.para],
        subject: e.assunto,
        html: e.html,
        text: e.texto,
        ...(e.linkCancelar
          ? {
              headers: {
                // o Gmail e o Outlook leem isto e mostram "Cancelar inscrição"
                // ao lado do remetente — sair da lista fica a um clique, sem
                // precisar caçar o link no rodapé
                "List-Unsubscribe": `<${e.linkCancelar}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              },
            }
          : {}),
      }),
    });

    if (!resposta.ok) return { ok: false, erro: `HTTP ${resposta.status}: ${await resposta.text()}` };
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : String(erro) };
  }
}

/**
 * Modelo do aviso de conteúdo novo.
 *
 * HTML deliberadamente simples, com estilo embutido: cliente de e-mail não
 * entende folha de estilo externa nem metade do CSS moderno, e um layout
 * elaborado quebra em algum deles. A versão em texto puro vai junto porque
 * alguns clientes só mostram essa — e porque mensagem sem alternativa em texto
 * tem mais chance de cair no spam.
 */
export function modeloAviso(opcoes: {
  nome: string;
  titulo: string;
  resumo: string;
  url: string;
  linkCancelar: string;
}) {
  const { nome, titulo, resumo, url, linkCancelar } = opcoes;

  const html = `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:#f4f6f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px">
    <p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#0f766e">Novo no blog</p>
    <h1 style="margin:12px 0 0;font-size:23px;line-height:1.3;color:#0f172a">${escapar(titulo)}</h1>
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#475569">Olá, ${escapar(nome)}. ${escapar(resumo)}</p>
    <p style="margin:28px 0 0">
      <a href="${url}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:15px;font-weight:600">Ler o artigo</a>
    </p>
    <hr style="margin:32px 0 0;border:none;border-top:1px solid #e2e8f0">
    <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#94a3b8">
      Você recebe este aviso porque pediu, ao se cadastrar no site.
      Este e-mail é informativo e <strong>não substitui consulta médica</strong>.<br>
      <a href="${linkCancelar}" style="color:#94a3b8">Não quero mais receber</a>
    </p>
  </div>
</body></html>`;

  const texto = [
    `Novo no blog: ${titulo}`,
    "",
    `Olá, ${nome}. ${resumo}`,
    "",
    `Leia em: ${url}`,
    "",
    "---",
    "Você recebe este aviso porque pediu, ao se cadastrar no site.",
    "Este e-mail é informativo e não substitui consulta médica.",
    `Para sair da lista: ${linkCancelar}`,
  ].join("\n");

  return { html, texto };
}

/** Título de artigo é texto de terceiro; sem escapar, um `<` quebraria o e-mail. */
function escapar(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
