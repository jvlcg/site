import { buildKnowledgeBase, systemPrompt } from "@/lib/knowledge";
import { fallbackAnswer } from "@/lib/chat-fallback";
import {
  CABECALHOS_API,
  corpoLimitado,
  excedeuLimite,
  excedeuTetoGlobal,
  identifica,
  mesmaOrigem,
} from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 12;
const MAX_CHARS = 800;
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

/** Limites por visitante: rajada curta e teto por hora. */
const LIMITE_MINUTO = 10;
const LIMITE_HORA = 60;

const json = (dados: unknown, status = 200) =>
  Response.json(dados, { status, headers: CABECALHOS_API });

/**
 * Diagnóstico protegido: GET /api/chat?token=... informa se a IA está ativa.
 *
 * Sem o token correto a rota responde 404, e não 401 — assim ela não revela
 * sequer que existe um diagnóstico ali. Defina DIAG_TOKEN na Vercel para usar.
 */
export async function GET(req: Request) {
  const esperado = process.env.DIAG_TOKEN;
  const enviado = new URL(req.url).searchParams.get("token");
  if (!esperado || enviado !== esperado) {
    return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  if (!key) {
    return json({
      ia: false,
      motivo: "ANTHROPIC_API_KEY não configurada",
      modo: "reserva por palavras-chave",
    });
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 8, messages: [{ role: "user", content: "ok" }] }),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return json({ ia: true, modelo: model, modo: "IA" });
    const erro = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    return json({
      ia: false,
      modelo: model,
      motivo: erro?.error?.message ?? `HTTP ${res.status}`,
      modo: "reserva por palavras-chave",
    });
  } catch (e) {
    return json({
      ia: false,
      motivo: e instanceof Error ? e.message : "falha de rede",
      modo: "reserva por palavras-chave",
    });
  }
}

export async function POST(req: Request) {
  // 1. só o próprio site pode chamar — barra uso do endpoint como proxy de IA
  if (!mesmaOrigem(req)) {
    return new Response("Not Found", { status: 404, headers: CABECALHOS_API });
  }

  // 2. teto global: limita o custo mesmo se vier de muitos IPs diferentes
  if (excedeuTetoGlobal()) {
    return json(
      { reply: "O assistente está com muitas conversas agora. Fale direto pelo WhatsApp.\n[AGENDAR]" },
      429
    );
  }

  // 3. limite por visitante, em duas janelas
  const quem = identifica(req);
  if (
    excedeuLimite(`min:${quem}`, LIMITE_MINUTO, 60_000) ||
    excedeuLimite(`hora:${quem}`, LIMITE_HORA, 60 * 60_000)
  ) {
    return json(
      { reply: "Recebi muitas mensagens seguidas. Aguarde um instante e tente de novo.\n[AGENDAR]" },
      429
    );
  }

  // 4. corpo pequeno e bem formado
  const body = (await corpoLimitado(req)) as { messages?: ChatMessage[] } | null;
  if (!body) {
    return json({ reply: "Não consegui entender a mensagem. Pode repetir?" }, 400);
  }

  const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const key = process.env.ANTHROPIC_API_KEY;

  // Sem chave configurada → assistente por palavras-chave (sempre funcional).
  if (!key) {
    return json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
        max_tokens: 400,
        system: [
          { type: "text", text: systemPrompt() },
          {
            type: "text",
            text: `BASE DE CONHECIMENTO:\n\n${buildKnowledgeBase()}`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: messages.length ? messages : [{ role: "user", content: "Olá" }],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      // Registra o motivo nos logs do servidor — o visitante recebe a resposta
      // reserva normalmente, sem ver erro.
      console.error("[chat] Anthropic respondeu", res.status, await res.text().catch(() => ""));
      return json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
    }

    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? [])
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("")
      .trim();

    return json({ reply: reply || fallbackAnswer(lastUser), mode: reply ? "ai" : "fallback" });
  } catch (e) {
    console.error("[chat] falha ao chamar a Anthropic:", e);
    return json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
  }
}
