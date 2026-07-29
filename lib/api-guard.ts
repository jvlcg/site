import { site } from "./site-config";

/**
 * Barreiras para as rotas de API.
 *
 * O risco real de um endpoint de chat público não é o visitante: é alguém
 * descobrir a URL e usá-la como proxy gratuito de IA, gerando custo na conta
 * da Anthropic. As defesas abaixo cobrem o abuso casual e automatizado.
 *
 * LIMITE IMPORTANTE: o contador de requisições vive na memória da instância.
 * Em ambiente serverless cada instância tem o seu, e eles somem a cada
 * reciclagem — isso é um redutor de velocidade, não um limite rígido. A
 * proteção robusta é a da borda (Vercel Firewall / WAF), documentada no README.
 */

/** Hosts extras autorizados, além do host da própria requisição. */
function hostsPermitidos(): string[] {
  const lista: string[] = [];
  try {
    lista.push(new URL(site.url).host);
  } catch {
    /* URL do site mal configurada — o host da requisição ainda cobre o caso */
  }
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const o of extra.split(",").map((s) => s.trim()).filter(Boolean)) {
      try {
        lista.push(new URL(o).host);
      } catch {
        lista.push(o);
      }
    }
  }
  return lista;
}

/** Host pelo qual a requisição realmente chegou (atrás do proxy da Vercel). */
function hostDaRequisicao(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-host");
  if (fwd) return fwd.split(",")[0].trim();
  const host = req.headers.get("host");
  if (host) return host;
  try {
    return new URL(req.url).host;
  } catch {
    return null;
  }
}

/**
 * Exige que a chamada venha do próprio site.
 *
 * A comparação é contra o **host da própria requisição**, não contra uma URL
 * fixa: assim funciona igual no domínio final, nos previews da Vercel e em
 * localhost, sem depender de a variável de ambiente estar certa. Um domínio
 * alternativo (por exemplo o `www`) pode ser liberado em ALLOWED_ORIGINS.
 *
 * Um navegador envia `Origin` em requisição POST; um `curl` avulso não envia
 * nada. Cabeçalho dá para forjar, então isto não é uma tranca — é o que corta
 * o abuso oportunista, que é a maior parte dele. A tranca de verdade é a do
 * firewall da borda, descrita no README.
 */
export function mesmaOrigem(req: Request): boolean {
  const proprio = hostDaRequisicao(req);
  const permitidos = new Set([...(proprio ? [proprio] : []), ...hostsPermitidos()]);

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return permitidos.has(new URL(origin).host);
    } catch {
      return false;
    }
  }

  // sem Origin: aceita se o Referer for do mesmo host (navegação normal)
  const referer = req.headers.get("referer");
  if (!referer) return false;
  try {
    return permitidos.has(new URL(referer).host);
  } catch {
    return false;
  }
}

/** Identificador do chamador — melhor esforço atrás de proxy. */
export function identifica(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "desconhecido"
  );
}

type Janela = { marcas: number[] };
const porChave = new Map<string, Janela>();
let ultimaLimpeza = Date.now();

/**
 * Limite por janela deslizante. Diferente do contador fixo, não permite o
 * dobro das requisições na virada da janela.
 *
 * @param chave quem está chamando
 * @param max requisições permitidas
 * @param janelaMs tamanho da janela
 */
export function excedeuLimite(chave: string, max: number, janelaMs: number): boolean {
  const agora = Date.now();

  // limpeza periódica para o mapa não crescer sem limite
  if (agora - ultimaLimpeza > 5 * 60_000) {
    for (const [k, v] of porChave) {
      if (v.marcas.every((t) => agora - t > janelaMs)) porChave.delete(k);
    }
    ultimaLimpeza = agora;
  }

  const reg = porChave.get(chave) ?? { marcas: [] };
  reg.marcas = reg.marcas.filter((t) => agora - t < janelaMs);
  if (reg.marcas.length >= max) {
    porChave.set(chave, reg);
    return true;
  }
  reg.marcas.push(agora);
  porChave.set(chave, reg);
  return false;
}

/** Teto global de chamadas por hora — limita o custo mesmo sob ataque distribuído. */
export function excedeuTetoGlobal(max = 600): boolean {
  return excedeuLimite("__global__", max, 60 * 60_000);
}

/** Lê o corpo recusando payloads grandes antes de fazer o parse. */
export async function corpoLimitado(req: Request, maxBytes = 8_000): Promise<unknown | null> {
  const declarado = Number(req.headers.get("content-length") ?? 0);
  if (declarado > maxBytes) return null;
  const texto = await req.text();
  if (texto.length > maxBytes) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/** Cabeçalhos padrão das respostas de API: nunca cacheia, nunca indexa. */
export const CABECALHOS_API = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
} as const;
