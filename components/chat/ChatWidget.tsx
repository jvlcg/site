"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { site, whatsappLink } from "@/lib/site-config";
import { FAQ, CATEGORIAS, type FaqEntry } from "@/lib/chat-faq";

type Msg = { role: "user" | "assistant"; content: string };

const SAUDACAO = `Olá! Sou o assistente virtual do consultório do ${site.shortName}.\n\nEscolha uma pergunta abaixo para uma resposta detalhada — ou escreva a sua dúvida no campo de texto.`;

/** Separa a marca [AGENDAR] do texto da resposta. */
function parse(content: string) {
  const cta = /\[AGENDAR\]/i.test(content);
  return { text: content.replace(/\[AGENDAR\]/gi, "").trim(), cta };
}

/** Renderiza **negrito** e quebras de parágrafo das respostas do FAQ. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className={i > 0 ? "mt-2 block" : "block"}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold text-[var(--fg)]">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </span>
      ))}
    </>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: SAUDACAO }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Agendamento");
  const [showFaq, setShowFaq] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // convite discreto após alguns segundos (uma vez por sessão)
  useEffect(() => {
    if (sessionStorage.getItem("chat-visto")) return;
    const t = setTimeout(() => setUnread(true), 12_000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    if (!open) return;
    sessionStorage.setItem("chat-visto", "1");
    setUnread(false);
    // trava o scroll do fundo só no mobile (painel ocupa a tela)
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isMobile) document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      document.documentElement.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /** Resposta instantânea do FAQ — sem chamar a API. */
  function answerFaq(entry: FaqEntry) {
    setShowFaq(false);
    setMsgs((prev) => [
      ...prev,
      { role: "user", content: entry.full ?? entry.q },
    ]);
    setLoading(true);
    // pequeno atraso dá naturalidade à conversa
    setTimeout(() => {
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: entry.a + (entry.cta ? "\n[AGENDAR]" : "") },
      ]);
      setLoading(false);
    }, 380);
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;
    setShowFaq(false);
    const next: Msg[] = [...msgs, { role: "user", content: clean }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m.content !== SAUDACAO) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMsgs([...next, { role: "assistant", content: data.reply ?? "Não consegui responder agora. Tente novamente." }]);
    } catch {
      setMsgs([
        ...next,
        {
          role: "assistant",
          content:
            "Estou com dificuldade de conexão. Se preferir, fale direto com o consultório pelo WhatsApp.\n[AGENDAR]",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar assistente virtual" : "Abrir assistente virtual"}
        aria-expanded={open}
        className="glass fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_14px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105 sm:bottom-24"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.8-4.5A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.4 8.4z" />
            </svg>
            {unread && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-70" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[var(--accent)]" />
              </span>
            )}
          </>
        )}
      </button>

      {/* Painel */}
      <div
        role="dialog"
        aria-label="Assistente virtual do consultório"
        aria-hidden={!open}
        className={`fixed z-[69] flex flex-col overflow-hidden transition-all duration-400 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        } inset-x-0 bottom-0 top-0 sm:inset-auto sm:bottom-40 sm:right-6 sm:top-auto sm:h-[560px] sm:max-h-[75vh] sm:w-[400px] sm:rounded-3xl`}
        style={{ background: "var(--bg)" }}
      >
        <div className="glass flex h-full flex-col sm:rounded-3xl">
          {/* cabeçalho */}
          <header className="flex items-center gap-3 border-b hairline px-5 py-4">
            <LogoMark className="h-9 w-9 shrink-0 text-[var(--fg)]" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold">Assistente do consultório</p>
              <p className="text-[0.7rem] text-faint">
                Tira dúvidas · não substitui consulta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-muted transition-colors hover:text-[var(--fg)]"
            >
              ×
            </button>
          </header>

          {/* mensagens */}
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {msgs.map((m, i) => {
              const { text, cta } = parse(m.content);
              const mine = m.role === "user";
              return (
                <div key={i} className={mine ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-[0.9rem] leading-relaxed ${
                      mine
                        ? "whitespace-pre-wrap bg-[var(--accent-soft)] text-[var(--fg)]"
                        : "glass text-muted"
                    }`}
                  >
                    {mine ? text : <RichText text={text} />}
                    {cta && (
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-3 flex w-full justify-center !py-2.5 text-[0.85rem]"
                      >
                        Agendar pelo WhatsApp →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="glass inline-flex items-center gap-1.5 rounded-2xl px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--accent)]"
                    style={{ animationDelay: `${d * 130}ms` }}
                  />
                ))}
              </div>
            )}

            {/* FAQ clicável */}
            {showFaq && !loading && (
              <div className="pt-1">
                <p className="font-mono-tech mb-2.5 text-[0.64rem] uppercase tracking-[0.16em] text-faint">
                  Perguntas frequentes
                </p>

                {/* categorias */}
                <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
                  {CATEGORIAS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[0.74rem] transition-colors ${
                        cat === c
                          ? "bg-[var(--accent)] font-medium text-[#06231d]"
                          : "glass text-muted hover:text-[var(--fg)]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* perguntas da categoria */}
                <div className="space-y-2">
                  {FAQ.filter((f) => f.categoria === cat).map((f) => (
                    <button
                      key={f.q}
                      type="button"
                      onClick={() => answerFaq(f)}
                      className="glass card-hover flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-[0.84rem] leading-snug transition-colors hover:text-[var(--accent)]"
                    >
                      <span>{f.q}</span>
                      <span aria-hidden="true" className="shrink-0 text-[var(--accent)]">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* reabrir o FAQ depois de uma resposta */}
            {!showFaq && !loading && (
              <button
                type="button"
                onClick={() => setShowFaq(true)}
                className="glass mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-[0.78rem] text-muted transition-colors hover:text-[var(--accent)]"
              >
                <span aria-hidden="true">☰</span> Ver todas as perguntas
              </button>
            )}
          </div>

          {/* entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t hairline p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva sua dúvida…"
                aria-label="Sua mensagem"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-[0.9rem] outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Enviar mensagem"
                className="btn-primary !px-4 !py-2.5 disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="px-2 pt-2 text-[0.66rem] leading-snug text-faint">
              Assistente automático. Não realiza diagnóstico nem orientação de tratamento.
              Em emergências, ligue 192.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
