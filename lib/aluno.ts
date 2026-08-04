import crypto from "node:crypto";
import { cookies } from "next/headers";
import { cifrar, decifrar } from "./cadastro";
import { comandoRedis, paresDeHash, redisConfigurado } from "./redis";

/**
 * Conta de aluno e matrículas nos cursos.
 *
 * ## A separação que sustenta tudo isto
 *
 * **A conta de aluno não é conta de paciente, e não dá acesso a nada clínico.**
 *
 * Os cadastros de paciente (`lib/cadastro.ts`) guardam CPF, data de nascimento
 * e telefone, cifrados, e só são lidos na área restrita atrás de senha. As
 * matrículas moram em outra chave do banco, guardam apenas e-mail e nome, e o
 * login do aluno não abre porta nenhuma para o outro lado.
 *
 * Isso é deliberado e não deve ser afrouxado depois por conveniência: no dia em
 * que uma sessão de aluno alcançar a ficha de paciente, uma senha de curso
 * vazada passa a valer prontuário.
 *
 * ## A sessão
 *
 * Cookie assinado, não cifrado. O conteúdo (nome e e-mail) é do próprio dono e
 * não é segredo; o que precisa ser impossível é **alterá-lo** — trocar o
 * e-mail dentro do cookie seria entrar na conta alheia. Por isso HMAC.
 *
 * Sem banco de sessão de propósito: o cookie se valida sozinho, o que significa
 * que o login continua funcionando mesmo com o Redis fora do ar. Só a matrícula
 * de curso pago precisa do banco.
 */

const COOKIE = "aluno";
const DURACAO_DIAS = 30;
const CHAVE_MATRICULAS = "matriculas";

function segredo(): Buffer | null {
  const bruto = process.env.SESSAO_CHAVE;
  if (!bruto || bruto.length < 32) return null;
  return crypto.createHash("sha256").update(bruto).digest();
}

export const sessaoConfigurada = () => segredo() !== null;

export type Aluno = { email: string; nome: string };
type Carga = Aluno & { exp: number };

const b64 = {
  para: (s: string) => Buffer.from(s, "utf8").toString("base64url"),
  de: (s: string) => Buffer.from(s, "base64url").toString("utf8"),
};

function assinar(corpo: string, chave: Buffer) {
  return crypto.createHmac("sha256", chave).update(corpo).digest("base64url");
}

/** Monta o valor do cookie. `null` se a chave de sessão não estiver configurada. */
export function criarSessao(aluno: Aluno): string | null {
  const chave = segredo();
  if (!chave) return null;
  const carga: Carga = {
    email: aluno.email.toLowerCase(),
    nome: aluno.nome,
    exp: Date.now() + DURACAO_DIAS * 86_400_000,
  };
  const corpo = b64.para(JSON.stringify(carga));
  return `${corpo}.${assinar(corpo, chave)}`;
}

/**
 * Lê e valida o cookie. `null` para qualquer problema.
 *
 * A comparação da assinatura usa `timingSafeEqual`: comparar com `===` vaza,
 * pelo tempo que a comparação leva, quantos caracteres iniciais estavam certos
 * — e isso é o bastante para descobrir a assinatura correta a partir de muitas
 * tentativas.
 */
export function lerSessao(valor: string | undefined): Aluno | null {
  const chave = segredo();
  if (!chave || !valor) return null;

  const corte = valor.lastIndexOf(".");
  if (corte < 1) return null;
  const corpo = valor.slice(0, corte);
  const assinatura = valor.slice(corte + 1);

  try {
    const esperada = Buffer.from(assinar(corpo, chave), "base64url");
    const recebida = Buffer.from(assinatura, "base64url");
    if (esperada.length !== recebida.length) return null;
    if (!crypto.timingSafeEqual(esperada, recebida)) return null;

    const carga = JSON.parse(b64.de(corpo)) as Carga;
    if (typeof carga.exp !== "number" || carga.exp < Date.now()) return null;
    if (!carga.email) return null;
    return { email: carga.email, nome: carga.nome ?? "" };
  } catch {
    return null;
  }
}

/** O aluno da requisição atual, lido do cookie. */
export async function alunoAtual(): Promise<Aluno | null> {
  const jar = await cookies();
  return lerSessao(jar.get(COOKIE)?.value);
}

export const opcoesCookie = {
  name: COOKIE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: DURACAO_DIAS * 86_400,
};

// ──────────────────────────────────────────────────────── matrículas

/**
 * O campo no banco é o resumo do e-mail, não o e-mail.
 *
 * Nome de campo em Redis não é cifrado — ele aparece inteiro para quem listar
 * as chaves, inclusive para o provedor de hospedagem. Guardar o e-mail ali
 * entregaria a lista de alunos a quem só deveria ver blocos ilegíveis. O
 * resumo permite a busca direta (sabendo o e-mail, chega-se ao campo) sem
 * permitir o caminho inverso.
 */
const campoDe = (email: string, curso: string) =>
  `${crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32)}:${curso}`;

export type Matricula = {
  email: string;
  nome: string;
  curso: string;
  criadoEm: string;
  /** Como a matrícula surgiu: liberada à mão, entrada em curso gratuito, pagamento. */
  origem: "manual" | "cadastro" | "pagamento";
};

export const matriculasConfiguradas = redisConfigurado;

export async function matricular(m: Omit<Matricula, "criadoEm">): Promise<boolean> {
  const existente = await buscarMatricula(m.email, m.curso);
  // Matricular de novo não reinicia o relógio da liberação gradual: quem já
  // está no curso há duas semanas não volta para o primeiro dia porque alguém
  // clicou duas vezes.
  if (existente) return true;

  const pacote = cifrar({ ...m, criadoEm: new Date().toISOString() });
  if (!pacote) return false;
  return (
    (await comandoRedis("HSET", CHAVE_MATRICULAS, campoDe(m.email, m.curso), pacote)) !== null
  );
}

export async function buscarMatricula(email: string, curso: string): Promise<Matricula | null> {
  const bruto = await comandoRedis<string>("HGET", CHAVE_MATRICULAS, campoDe(email, curso));
  return bruto ? decifrar<Matricula>(bruto) : null;
}

export async function cancelarMatricula(email: string, curso: string): Promise<boolean> {
  return (await comandoRedis("HDEL", CHAVE_MATRICULAS, campoDe(email, curso))) !== null;
}

/** Todas as matrículas, da mais recente para a mais antiga. Só para a área restrita. */
export async function listarMatriculas(): Promise<Matricula[]> {
  const bruto = await comandoRedis<Record<string, string> | string[]>(
    "HGETALL",
    CHAVE_MATRICULAS
  );
  if (!bruto) return [];

  const lista: Matricula[] = [];
  for (const [, pacote] of paresDeHash(bruto)) {
    const m = decifrar<Matricula>(pacote);
    if (m) lista.push(m);
  }
  return lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}
