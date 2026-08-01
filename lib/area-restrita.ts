import crypto from "node:crypto";

/**
 * Porta da área restrita — onde o Dr. José Victor vê as fichas.
 *
 * Uma senha só, guardada em variável de ambiente. É proporcional: existe um
 * único usuário, e trazer um sistema de contas inteiro para isso adicionaria
 * mais superfície de ataque do que segurança.
 *
 * O que protege de verdade:
 *
 * - **Comparação em tempo constante.** Comparar senha com `===` vaza o tamanho
 *   do prefixo certo pelo tempo de resposta, e isso é suficiente para descobrir
 *   a senha caractere a caractere.
 * - **A senha não vira o cookie.** O cookie é um bilhete assinado com HMAC e
 *   com prazo; quem o roubar não descobre a senha, e ele expira sozinho.
 * - **Cookie `httpOnly`**, invisível para JavaScript, o que tira do mapa o
 *   roubo de sessão por script injetado.
 */

export const COOKIE = "area-restrita";
/** Oito horas: um turno de trabalho, sem obrigar a entrar de novo o tempo todo. */
const VALIDADE_MS = 8 * 60 * 60 * 1000;

const senhaConfigurada = () => process.env.ADMIN_SENHA ?? "";

export const areaConfigurada = () => senhaConfigurada().length >= 10;

/** Chave de assinatura do bilhete: própria se houver, derivada da senha se não. */
function segredo(): Buffer {
  const proprio = process.env.ADMIN_SEGREDO;
  return crypto.createHash("sha256").update(proprio || senhaConfigurada()).digest();
}

export function senhaConfere(tentativa: string): boolean {
  const certa = senhaConfigurada();
  if (!certa) return false;
  // o hash iguala o tamanho dos dois lados: sem isso, `timingSafeEqual` lança
  // exceção quando os tamanhos diferem e o erro em si já entrega a informação
  const a = crypto.createHash("sha256").update(tentativa).digest();
  const b = crypto.createHash("sha256").update(certa).digest();
  return crypto.timingSafeEqual(a, b);
}

export function criarBilhete(): string {
  const expira = Date.now() + VALIDADE_MS;
  const corpo = String(expira);
  const assinatura = crypto.createHmac("sha256", segredo()).update(corpo).digest("base64url");
  return `${corpo}.${assinatura}`;
}

export function bilheteValido(bilhete: string | undefined): boolean {
  if (!bilhete) return false;
  const [corpo, assinatura] = bilhete.split(".");
  if (!corpo || !assinatura) return false;

  const esperada = crypto.createHmac("sha256", segredo()).update(corpo).digest("base64url");
  const a = Buffer.from(assinatura);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Number(corpo) > Date.now();
}

/** Atributos do cookie. `strict` porque nenhuma navegação legítima vem de fora. */
export function cookieDeSessao(bilhete: string | null): string {
  const base = `${COOKIE}=${bilhete ?? ""}; Path=/; HttpOnly; SameSite=Strict; Secure`;
  return bilhete ? `${base}; Max-Age=${VALIDADE_MS / 1000}` : `${base}; Max-Age=0`;
}

export function lerCookie(req: Request, nome: string): string | undefined {
  const bruto = req.headers.get("cookie");
  if (!bruto) return undefined;
  for (const parte of bruto.split(";")) {
    const [k, ...v] = parte.trim().split("=");
    if (k === nome) return v.join("=");
  }
  return undefined;
}
