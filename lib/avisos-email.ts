import crypto from "node:crypto";
import { comandoRedis, paresDeHash } from "./redis";

/**
 * Lista de quem aceitou receber avisos de conteúdo novo por e-mail.
 *
 * **Por que é uma lista separada do cadastro de pacientes**, e não um campo
 * dentro dele:
 *
 * O robô que dispara os avisos roda no GitHub, e para ler e-mails ele precisa
 * da chave que decifra a lista. Se os e-mails morassem junto do cadastro, essa
 * chave teria de ser a `CADASTRO_CHAVE` — a mesma que protege nome completo,
 * CPF e data de nascimento. Ela deixaria de existir só no painel da Vercel e
 * passaria a existir também nos segredos do GitHub, dobrando as portas por onde
 * o dado clínico pode vazar.
 *
 * Com lista separada e chave própria (`AVISOS_CHAVE`), o pior caso muda de
 * tamanho: quem obtiver essa chave vê uma lista de e-mails e primeiros nomes —
 * ruim, mas incomparável a CPF e data de nascimento de paciente.
 *
 * É o mesmo princípio de não usar a mesma chave para o cofre e para o portão.
 */

const CHAVE_REDIS = "avisos:email";

export type Assinante = {
  email: string;
  /** Primeiro nome, só para o e-mail não começar com "Olá," seco. */
  nome: string;
  criadoEm: string;
};

// -------------------------------------------------------------- criptografia

function chave(): Buffer | null {
  const bruta = process.env.AVISOS_CHAVE;
  if (!bruta) return null;
  if (/^[0-9a-f]{64}$/i.test(bruta)) return Buffer.from(bruta, "hex");
  const b64 = Buffer.from(bruta, "base64");
  if (b64.length === 32) return b64;
  return crypto.createHash("sha256").update(bruta).digest();
}

export const avisosConfigurados = () => chave() !== null;

function cifrar(dados: unknown): string | null {
  const k = chave();
  if (!k) return null;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", k, iv);
  const corpo = Buffer.concat([c.update(JSON.stringify(dados), "utf8"), c.final()]);
  return [iv.toString("base64"), c.getAuthTag().toString("base64"), corpo.toString("base64")].join(".");
}

function decifrar<T>(pacote: string): T | null {
  const k = chave();
  if (!k) return null;
  try {
    const [iv, tag, corpo] = pacote.split(".");
    const d = crypto.createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64"));
    d.setAuthTag(Buffer.from(tag, "base64"));
    return JSON.parse(
      Buffer.concat([d.update(Buffer.from(corpo, "base64")), d.final()]).toString("utf8")
    ) as T;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------- lista

/**
 * Identificador do assinante: resumo do e-mail em minúsculas.
 *
 * Usar o resumo, e não o e-mail, evita que a simples listagem das chaves do
 * banco entregue quem está inscrito. E, sendo determinístico, quem se cadastrar
 * duas vezes ocupa uma linha só.
 */
export const idDoEmail = (email: string) =>
  crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("base64url").slice(0, 22);

export async function inscreverEmail(email: string, nome: string): Promise<boolean> {
  const pacote = cifrar({
    email: email.trim().toLowerCase(),
    nome: nome.trim().split(" ")[0],
    criadoEm: new Date().toISOString(),
  } satisfies Assinante);
  if (!pacote) return false;
  return (await comandoRedis("HSET", CHAVE_REDIS, idDoEmail(email), pacote)) !== null;
}

export async function cancelarEmail(email: string): Promise<boolean> {
  return (await comandoRedis("HDEL", CHAVE_REDIS, idDoEmail(email))) !== null;
}

export async function listarAssinantes(): Promise<Assinante[]> {
  const bruto = await comandoRedis<Record<string, string> | string[]>("HGETALL", CHAVE_REDIS);
  if (!bruto) return [];
  const lista: Assinante[] = [];
  for (const [, pacote] of paresDeHash(bruto)) {
    const a = decifrar<Assinante>(pacote);
    if (a?.email) lista.push(a);
  }
  return lista;
}

export async function contarAssinantes(): Promise<number> {
  return (await comandoRedis<number>("HLEN", CHAVE_REDIS)) ?? 0;
}

// ------------------------------------------------------- link de cancelamento

/**
 * Todo e-mail precisa trazer um jeito de sair da lista em um clique — é
 * exigência prática de qualquer serviço de envio e, mais que isso, é o que
 * separa um aviso de um incômodo.
 *
 * O link carrega o e-mail e uma assinatura. Sem a assinatura, bastaria trocar o
 * endereço na URL para descadastrar outra pessoa.
 */
function segredoDoLink(): Buffer {
  return crypto.createHash("sha256").update(process.env.AVISOS_CHAVE ?? "").digest();
}

export function linkDeCancelamento(email: string, base: string): string {
  const alvo = email.trim().toLowerCase();
  const assinatura = crypto
    .createHmac("sha256", segredoDoLink())
    .update(alvo)
    .digest("base64url")
    .slice(0, 32);
  return `${base}/cancelar-avisos?e=${encodeURIComponent(alvo)}&a=${assinatura}`;
}

export function linkValido(email: string, assinatura: string): boolean {
  const esperada = crypto
    .createHmac("sha256", segredoDoLink())
    .update(email.trim().toLowerCase())
    .digest("base64url")
    .slice(0, 32);
  const a = Buffer.from(assinatura);
  const b = Buffer.from(esperada);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
