import crypto from "node:crypto";
import { site } from "./site-config";

/**
 * Verificação do token de identidade do Google (Sign in with Google).
 *
 * O que este arquivo faz e o que **não** faz:
 *
 * Ele confere que um token realmente veio do Google e é destinado a este site,
 * e devolve o nome e o e-mail que o Google garante. Só isso. Não cria conta,
 * não abre sessão, não guarda nada — o site não tem login de paciente, e nada
 * aqui aproxima disso.
 *
 * O uso é único: o visitante clica em "Continuar com Google", o formulário de
 * cadastro já vem com o nome e o e-mail preenchidos, e a ficha gravada leva a
 * marca de que aquele e-mail **existe e é dele**. Sem isso, quem digita
 * `joao@gmial.com` some para sempre, e ninguém percebe.
 *
 * ## Por que não usamos o client_secret
 *
 * Porque não é preciso. O `client_secret` serve ao fluxo de código de
 * autorização — aquele em que o site pede acesso *continuado* à conta da
 * pessoa (ler a agenda, mandar e-mail em nome dela). Aqui o Google já entrega
 * a identidade assinada, e conferir uma assinatura exige a chave **pública**
 * dele, não um segredo nosso. Um segredo a menos para guardar é um segredo a
 * menos para vazar.
 *
 * ## O que é conferido, e por que cada item importa
 *
 * - **assinatura RS256** contra as chaves públicas do Google — sem isso o
 *   token é apenas texto que qualquer um escreve;
 * - **`alg` do cabeçalho** preso em RS256 — aceitar o que o token pede é a
 *   falha clássica de JWT: um token com `alg: none` passaria sem assinatura;
 * - **`aud`** igual ao nosso client_id — impede que um token legítimo, emitido
 *   para outro site, seja reaproveitado aqui;
 * - **`iss`** do Google;
 * - **`exp`/`iat`** dentro da validade, com folga de um minuto para relógio
 *   fora de hora;
 * - **`email_verified`** — o Google emite token para conta com e-mail ainda
 *   não confirmado, e é justamente a confirmação que estamos buscando.
 */

const CERTIFICADOS = "https://www.googleapis.com/oauth2/v3/certs";
const EMISSORES = ["https://accounts.google.com", "accounts.google.com"];
/** Tolerância de relógio. Um minuto cobre a deriva normal entre servidores. */
const FOLGA = 60;

export const googleIdentidadeConfigurada = () => !!site.googleClientId;

export type IdentidadeGoogle = { nome: string; email: string };

type Jwk = { kid: string; alg: string; [k: string]: unknown };

/**
 * Cache das chaves públicas do Google.
 *
 * Elas giram a cada poucos dias, e buscar a cada cadastro seria uma ida à rede
 * no meio de um formulário. O prazo vem do `Cache-Control` da própria resposta
 * — o Google diz quanto tempo vale, e obedecer isso é o que faz a rotação
 * funcionar sem intervenção.
 */
let cache: { chaves: Jwk[]; expiraEm: number } | null = null;

async function chavesDoGoogle(): Promise<Jwk[]> {
  if (cache && cache.expiraEm > Date.now()) return cache.chaves;

  const resposta = await fetch(CERTIFICADOS);
  if (!resposta.ok) throw new Error("certificados indisponíveis");

  const { keys } = (await resposta.json()) as { keys: Jwk[] };
  const controle = resposta.headers.get("cache-control") ?? "";
  const idade = Number(controle.match(/max-age=(\d+)/)?.[1] ?? 3600);

  cache = { chaves: keys, expiraEm: Date.now() + idade * 1000 };
  return keys;
}

const daBase64url = (s: string) => Buffer.from(s, "base64url");
const objetoDe = <T,>(s: string): T => JSON.parse(daBase64url(s).toString("utf8"));

type Carga = {
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
};

/**
 * Devolve a identidade se o token for válido, ou `null` em qualquer outro caso.
 *
 * `null` para tudo é deliberado: quem chama não deve tomar decisão diferente
 * por "assinatura errada" ou "token vencido". Nos dois casos o resultado é o
 * mesmo — a ficha é gravada sem a marca de e-mail verificado, e o cadastro
 * segue normalmente. Um cadastro nunca é recusado por causa disto.
 */
export async function verificarIdentidade(token: unknown): Promise<IdentidadeGoogle | null> {
  const clientId = site.googleClientId;
  if (!clientId) return null;
  if (typeof token !== "string" || token.length > 4_000) return null;

  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [cabecalhoB64, cargaB64, assinaturaB64] = partes;

  try {
    const cabecalho = objetoDe<{ alg?: string; kid?: string }>(cabecalhoB64);
    if (cabecalho.alg !== "RS256" || !cabecalho.kid) return null;

    const jwk = (await chavesDoGoogle()).find((k) => k.kid === cabecalho.kid);
    if (!jwk) return null;

    const chave = crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: "jwk" });
    const assinado = Buffer.from(`${cabecalhoB64}.${cargaB64}`, "utf8");
    const confere = crypto.verify(
      "RSA-SHA256",
      assinado,
      chave,
      daBase64url(assinaturaB64)
    );
    if (!confere) return null;

    const carga = objetoDe<Carga>(cargaB64);
    const agora = Math.floor(Date.now() / 1000);

    if (!carga.iss || !EMISSORES.includes(carga.iss)) return null;
    if (carga.aud !== clientId) return null;
    if (typeof carga.exp !== "number" || carga.exp + FOLGA < agora) return null;
    if (typeof carga.iat === "number" && carga.iat - FOLGA > agora) return null;
    if (carga.email_verified !== true) return null;

    const email = carga.email?.trim().toLowerCase();
    if (!email) return null;

    return { nome: (carga.name ?? carga.given_name ?? "").trim(), email };
  } catch {
    return null;
  }
}
