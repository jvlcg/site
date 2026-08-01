import { comandoRedis, paresDeHash, redisConfigurado } from "./redis";

/**
 * Onde ficam guardadas as inscrições nas notificações.
 *
 * Uma inscrição é o endereço do aparelho no serviço de push do navegador
 * (Google para Chrome/Android, Apple para Safari/iPhone, Mozilla para Firefox)
 * mais duas chaves de criptografia. **Não há nome, e-mail, telefone nem nada
 * que identifique a pessoa** — é um endereço de entrega, e só.
 *
 * O armazenamento é um Redis pela API REST, que é o que a Vercel entrega no
 * marketplace (Upstash). Escolha deliberada: a Vercel roda funções sem disco,
 * então qualquer lista precisa viver fora do código. REST em vez de conexão
 * TCP porque funciona em ambiente serverless sem manter conexão aberta.
 *
 * **Sem as variáveis configuradas, tudo aqui devolve "não configurado" e o site
 * simplesmente não oferece notificação.** Nada quebra.
 */

const CHAVE = "notificacoes:assinaturas";

export const armazenamentoConfigurado = redisConfigurado;

export type Assinatura = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

/**
 * Identificador curto e estável de uma inscrição.
 *
 * O endereço de push é longo demais para virar campo de hash, então usamos um
 * resumo dele. Serve só para não guardar o mesmo aparelho duas vezes — não
 * precisa ser criptograficamente forte, e o endereço completo continua salvo no
 * valor.
 */
export function idDaAssinatura(endpoint: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < endpoint.length; i++) {
    const c = endpoint.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c, 0x85ebca6b) >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}

export async function salvarAssinatura(a: Assinatura): Promise<boolean> {
  const r = await comandoRedis("HSET", CHAVE, idDaAssinatura(a.endpoint), JSON.stringify(a));
  return r !== null;
}

export async function removerAssinatura(endpoint: string): Promise<boolean> {
  const r = await comandoRedis("HDEL", CHAVE, idDaAssinatura(endpoint));
  return r !== null;
}

/** Todas as inscrições ativas. Usado só pelo script de envio. */
export async function listarAssinaturas(): Promise<Assinatura[]> {
  const bruto = await comandoRedis<Record<string, string> | string[]>("HGETALL", CHAVE);
  if (!bruto) return [];

  const valores = paresDeHash(bruto).map(([, v]) => v);

  const lista: Assinatura[] = [];
  for (const v of valores) {
    try {
      const a = JSON.parse(v) as Assinatura;
      if (a?.endpoint && a?.keys?.p256dh && a?.keys?.auth) lista.push(a);
    } catch {
      /* registro corrompido: ignora em vez de derrubar o envio inteiro */
    }
  }
  return lista;
}

/** Quantos aparelhos estão inscritos. */
export async function contarAssinaturas(): Promise<number> {
  return (await comandoRedis<number>("HLEN", CHAVE)) ?? 0;
}
