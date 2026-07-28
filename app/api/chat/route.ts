import { buildKnowledgeBase, systemPrompt } from "@/lib/knowledge";
import { fallbackAnswer } from "@/lib/chat-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 12;
const MAX_CHARS = 800;
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

/** Rate limit simples em memória (por instância) — evita abuso do endpoint. */
const hits = new Map<string, { n: number; t: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 20;
}

/**
 * Diagnóstico: GET /api/chat responde se a IA está ativa.
 * Não expõe a chave — só diz se ela existe e se a Anthropic aceitou a chamada.
 * Útil para conferir a configuração depois do deploy.
 */
export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  if (!key) {
    return Response.json({
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
    if (res.ok) return Response.json({ ia: true, modelo: model, modo: "IA" });
    const erro = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    return Response.json({
      ia: false,
      modelo: model,
      motivo: erro?.error?.message ?? `HTTP ${res.status}`,
      modo: "reserva por palavras-chave",
    });
  } catch (e) {
    return Response.json({
      ia: false,
      motivo: e instanceof Error ? e.message : "falha de rede",
      modo: "reserva por palavras-chave",
    });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return Response.json(
      { reply: "Recebi muitas mensagens seguidas. Aguarde um instante e tente de novo.\n[AGENDAR]" },
      { status: 429 }
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    messages = (body.messages ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  } catch {
    return Response.json({ reply: "Não consegui entender a mensagem. Pode repetir?" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const key = process.env.ANTHROPIC_API_KEY;

  // Sem chave configurada → assistente por palavras-chave (sempre funcional).
  if (!key) {
    return Response.json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
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
      return Response.json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
    }

    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? [])
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("")
      .trim();

    return Response.json({ reply: reply || fallbackAnswer(lastUser), mode: reply ? "ai" : "fallback" });
  } catch (e) {
    console.error("[chat] falha ao chamar a Anthropic:", e);
    return Response.json({ reply: fallbackAnswer(lastUser), mode: "fallback" });
  }
}
