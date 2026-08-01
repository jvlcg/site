/**
 * Conexão com o Redis (Upstash / Vercel Marketplace), pela API REST.
 *
 * Por que REST e não conexão TCP: a Vercel roda funções sem estado e sem disco.
 * Uma conexão persistente não sobrevive entre chamadas, e abrir uma a cada
 * requisição custa mais caro que o próprio comando.
 *
 * **O nome das variáveis não é fixo de propósito.** Ao instalar o banco, a
 * Vercel pergunta um "prefixo" e batiza as variáveis com ele — `STORAGE_…`,
 * `KV_…`, `UPSTASH_…`, ou o que a pessoa escrever. Amarrar o código a um nome
 * só significaria que escolher o prefixo errado quebra tudo em silêncio, com o
 * site respondendo "indisponível" sem dizer por quê. Então aqui procuramos o
 * par URL + token em qualquer nome, e o prefixo deixa de importar.
 */

type Credenciais = { url: string; token: string };

/** Nomes conhecidos, na ordem de preferência. */
const PARES_CONHECIDOS: [string, string][] = [
  ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
  ["REDIS_REST_API_URL", "REDIS_REST_API_TOKEN"],
];

/**
 * A URL tem de ser de API REST, não a `redis://` (ou `rediss://`) de conexão
 * direta — o Upstash publica as duas, e trocar uma pela outra é fácil.
 *
 * Aceita `http` além de `https` de propósito: em produção o endereço é sempre
 * https, mas exigir isso impediria apontar para um servidor local ao testar, o
 * que só empurraria o teste para longe do código real.
 */
const urlRest = (v: string | undefined): v is string =>
  typeof v === "string" && /^https?:\/\//.test(v);

function porNomeConhecido(): Credenciais | null {
  for (const [chaveUrl, chaveToken] of PARES_CONHECIDOS) {
    const url = process.env[chaveUrl];
    const token = process.env[chaveToken];
    if (urlRest(url) && token) return { url, token };
  }
  return null;
}

/**
 * Descoberta por padrão de nome: acha qualquer `X_URL` que aponte para uma API
 * REST de Redis e case com um `X_TOKEN` correspondente. É o que faz funcionar
 * quando o prefixo escolhido na instalação foi outro.
 */
function porDescoberta(): Credenciais | null {
  for (const [nome, valor] of Object.entries(process.env)) {
    if (!urlRest(valor)) continue;
    // só interessa endereço de Redis REST, não qualquer URL do ambiente
    if (!/upstash\.io|redis|kv/i.test(valor) && !/REDIS|KV|STORAGE/i.test(nome)) continue;

    const base = nome.replace(/_(REST_API_)?URL$/i, "");
    const token =
      process.env[`${base}_REST_API_TOKEN`] ??
      process.env[`${base}_TOKEN`] ??
      process.env[`${base}_REST_TOKEN`];
    if (token) return { url: valor, token };
  }
  return null;
}

function credenciais(): Credenciais | null {
  const achado = porNomeConhecido() ?? porDescoberta();
  return achado ? { ...achado, url: achado.url.replace(/\/+$/, "") } : null;
}

export const redisConfigurado = () => credenciais() !== null;

/**
 * Nome da variável de ambiente que foi encontrada — só o nome, nunca o valor.
 *
 * Serve para o diagnóstico da área restrita: sem isso, "banco não configurado"
 * não distingue "não instalei" de "instalei com um prefixo que o código não
 * reconheceu", e essas duas situações pedem ações opostas.
 */
export function nomeDaVariavelEncontrada(): string | null {
  const cred = credenciais();
  if (!cred) return null;
  for (const [nome, valor] of Object.entries(process.env)) {
    if (valor && valor.replace(/\/+$/, "") === cred.url) return nome;
  }
  return "(desconhecida)";
}

/** Confere que o banco responde de verdade, e não só que existe configuração. */
export async function bancoResponde(): Promise<boolean> {
  return (await comandoRedis<string>("PING")) !== null;
}

/**
 * Executa um comando do Redis. Devolve `null` quando não há banco configurado
 * ou quando a chamada falha — quem chama decide o que fazer com isso, em vez de
 * o site quebrar.
 */
export async function comandoRedis<T = unknown>(
  ...partes: (string | number)[]
): Promise<T | null> {
  const cred = credenciais();
  if (!cred) return null;
  try {
    const resposta = await fetch(cred.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cred.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(partes),
      cache: "no-store",
    });
    if (!resposta.ok) return null;
    return ((await resposta.json()) as { result?: T }).result ?? null;
  } catch {
    return null;
  }
}

/**
 * Normaliza a resposta de `HGETALL`, que volta como objeto no Upstash e como
 * lista alternando campo e valor num Redis REST cru.
 */
export function paresDeHash(bruto: Record<string, string> | string[]): [string, string][] {
  if (!Array.isArray(bruto)) return Object.entries(bruto);
  const pares: [string, string][] = [];
  for (let i = 0; i < bruto.length; i += 2) pares.push([bruto[i], bruto[i + 1]]);
  return pares;
}
