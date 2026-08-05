"use client";

import { useCallback, useEffect, useState } from "react";
import { NIVEIS } from "@/lib/niveis";

/**
 * Painel de pontos, dentro da área restrita.
 *
 * Faz duas coisas: mostra quem tem quantos pontos, e permite lançar
 * **reconhecimento** — que é o evento que só uma pessoa pode confirmar.
 *
 * Use-o quando alguém compartilhar seu conteúdo de verdade, quando um paciente
 * voltar para o retorno combinado, ou em qualquer situação que mereça o gesto e
 * que o site não tenha como perceber sozinho.
 *
 * O que **não** dá para fazer aqui é lançar indicação à mão. Não é limitação
 * esquecida: a indicação tem três travas anti-fraude, e uma porta que as
 * contornasse tornaria as três decorativas.
 */

type Evento = { tipo: string; pontos: number; em: string; nota?: string };
type Conta = { email: string; nome: string; total: number; eventos: Evento[]; codigo: string };

const nivelDe = (total: number) =>
  [...NIVEIS].reverse().find((n) => total >= n.minimo)?.nome ?? NIVEIS[0].nome;

const dataBonita = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });

export function PainelPontos() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [email, setEmail] = useState("");
  const [nota, setNota] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const r = await fetch("/api/pontos");
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setErro(d.erro ?? "Não foi possível carregar.");
      setContas(d.contas ?? []);
      setErro("");
    } catch {
      setErro("Sem conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function reconhecer(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setAviso("");
    try {
      const r = await fetch("/api/pontos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), tipo: "reconhecimento", nota: nota.trim() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setAviso(d.erro ?? "Não foi possível lançar.");
      setAviso(`+25 pontos para ${email.trim()}.`);
      setEmail("");
      setNota("");
      await carregar();
    } catch {
      setAviso("Sem conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  const filtradas = busca
    ? contas.filter((c) =>
        [c.email, c.nome, c.codigo].join(" ").toLowerCase().includes(busca.toLowerCase())
      )
    : contas;

  const campo =
    "glass w-full rounded-2xl px-4 py-3 text-[0.92rem] outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] transition-all focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <>
      <form onSubmit={reconhecer} className="glass rounded-2xl p-5 sm:p-6">
        <p className="font-display font-semibold">Lançar reconhecimento (+25)</p>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted">
          Para o que o site não consegue ver: alguém que compartilhou de
          verdade, um paciente que voltou para o retorno. A nota aparece no
          extrato da pessoa — escreva algo que faça sentido para ela ler.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            required
            placeholder="e-mail da pessoa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={campo}
          />
          <input
            type="text"
            placeholder="motivo (aparece para ela)"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className={campo}
          />
        </div>
        {aviso && <p className="mt-3 text-[0.84rem] text-[var(--accent)]">{aviso}</p>}
        <button type="submit" disabled={salvando || !email} className="btn-primary mt-4 !py-2.5 text-sm">
          {salvando ? "Lançando…" : "Lançar"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por e-mail, nome ou código…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="glass min-w-0 flex-1 rounded-full px-4 py-2.5 text-[0.9rem] outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button type="button" onClick={carregar} className="btn-ghost !py-2.5 text-sm">
          Atualizar
        </button>
      </div>

      {erro && <p className="mt-4 text-[0.85rem] text-red-400">{erro}</p>}

      <p className="font-mono-tech mt-4 text-[0.72rem] uppercase tracking-[0.14em] text-faint">
        {carregando ? "carregando…" : `${filtradas.length} de ${contas.length} conta(s)`}
      </p>

      <div className="mt-4 space-y-3">
        {filtradas.map((c) => {
          const indicacoes = c.eventos.filter((e) => e.tipo === "indicacaoConfirmada").length;
          return (
            <div key={c.email} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-semibold">{c.nome || c.email}</p>
                  <p className="mt-0.5 break-all text-[0.84rem] text-muted">{c.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono-tech text-[0.72rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                    {nivelDe(c.total)}
                  </p>
                  <p className="font-display text-lg font-semibold">{c.total}</p>
                </div>
              </div>
              <p className="font-mono-tech mt-3 text-[0.66rem] uppercase tracking-[0.14em] text-faint">
                código {c.codigo} · {indicacoes} indicação{indicacoes === 1 ? "" : "ões"} ·{" "}
                {c.eventos.length} lançamento{c.eventos.length === 1 ? "" : "s"}
              </p>
              {c.eventos.length > 0 && (
                <p className="mt-2 text-[0.78rem] text-faint">
                  último: {c.eventos[0].tipo}
                  {c.eventos[0].nota ? ` (${c.eventos[0].nota})` : ""} em{" "}
                  {dataBonita(c.eventos[0].em)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
