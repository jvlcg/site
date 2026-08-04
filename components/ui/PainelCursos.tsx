"use client";

import { useCallback, useEffect, useState } from "react";
import { CURSOS } from "@/content/cursos";

/**
 * Painel de matrículas dos cursos, dentro da área restrita.
 *
 * O que ele faz: liberar acesso a um curso pago para um e-mail, ver quem está
 * matriculado e cancelar. É o suficiente para vender por PIX sem nenhum
 * intermediário — você recebe o comprovante, libera aqui, e a pessoa entra com
 * a conta do Google dela.
 *
 * O que ele **não** faz: subir vídeo. Vídeo não passa por aqui e nem deveria —
 * arquivo de aula tem centenas de megabytes e vai para o serviço de vídeo, não
 * para o site. Ver `content/plano-cursos.md`.
 */

type Matricula = {
  email: string;
  nome: string;
  curso: string;
  criadoEm: string;
  origem: "manual" | "cadastro" | "pagamento";
};

const ORIGEM = {
  manual: "liberado à mão",
  cadastro: "entrou no curso gratuito",
  pagamento: "pagamento confirmado",
} as const;

const dataBonita = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

/** Só os cursos que exigem liberação — não faz sentido matricular alguém num curso aberto. */
const CURSOS_COM_MATRICULA = CURSOS.filter((c) => c.acesso !== "livre");

export function PainelCursos() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState(CURSOS_COM_MATRICULA[0]?.slug ?? "");
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const r = await fetch("/api/matriculas");
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setErro(d.erro ?? "Não foi possível carregar.");
      setMatriculas(d.matriculas ?? []);
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

  async function liberar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setAviso("");
    try {
      const r = await fetch("/api/matriculas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), nome: nome.trim(), curso }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setAviso(d.erro ?? "Não foi possível liberar.");
      setAviso(`Liberado para ${email.trim()}.`);
      setEmail("");
      setNome("");
      await carregar();
    } catch {
      setAviso("Sem conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  async function cancelar(m: Matricula) {
    if (!confirm(`Tirar o acesso de ${m.email} ao curso "${m.curso}"?`)) return;
    await fetch("/api/matriculas", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: m.email, curso: m.curso }),
    });
    setMatriculas((l) => l.filter((x) => !(x.email === m.email && x.curso === m.curso)));
  }

  const filtradas = busca
    ? matriculas.filter((m) =>
        [m.email, m.nome, m.curso].join(" ").toLowerCase().includes(busca.toLowerCase())
      )
    : matriculas;

  const campo =
    "glass w-full rounded-2xl px-4 py-3 text-[0.92rem] outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] transition-all focus:ring-2 focus:ring-[var(--accent)]";

  if (CURSOS_COM_MATRICULA.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <p className="font-display font-semibold">Nenhum curso com matrícula ainda</p>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
          Cursos abertos não têm matrícula — qualquer pessoa assiste. Este painel
          passa a valer quando existir um curso <strong>pago</strong> ou{" "}
          <strong>gratuito com conta</strong> em{" "}
          <code className="font-mono-tech text-[0.84rem]">content/cursos.ts</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={liberar} className="glass rounded-2xl p-5 sm:p-6">
        <p className="font-display font-semibold">Liberar acesso</p>
        <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted">
          Use o <strong>mesmo e-mail</strong> que a pessoa vai usar para entrar
          com o Google. E-mail diferente é a causa de quase todo “paguei e não
          consigo assistir”.
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
            placeholder="nome (opcional)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={campo}
          />
          <select value={curso} onChange={(e) => setCurso(e.target.value)} className={`${campo} sm:col-span-2`}>
            {CURSOS_COM_MATRICULA.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.titulo} {c.acesso === "pago" ? "(pago)" : "(gratuito com conta)"}
              </option>
            ))}
          </select>
        </div>
        {aviso && <p className="mt-3 text-[0.84rem] text-[var(--accent)]">{aviso}</p>}
        <button type="submit" disabled={salvando || !email} className="btn-primary mt-4 !py-2.5 text-sm">
          {salvando ? "Liberando…" : "Liberar acesso"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por e-mail, nome ou curso…"
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
        {carregando ? "carregando…" : `${filtradas.length} de ${matriculas.length} matrícula(s)`}
      </p>

      <div className="mt-4 space-y-3">
        {filtradas.map((m) => (
          <div key={`${m.email}:${m.curso}`} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display font-semibold">{m.nome || m.email}</p>
                <p className="mt-0.5 break-all text-[0.84rem] text-muted">{m.email}</p>
                <p className="mt-1 text-[0.76rem] text-faint">
                  {m.curso} · {dataBonita(m.criadoEm)} · {ORIGEM[m.origem] ?? m.origem}
                </p>
              </div>
              <button
                type="button"
                onClick={() => cancelar(m)}
                className="text-[0.8rem] text-faint underline underline-offset-2 transition-colors hover:text-red-400"
              >
                Tirar acesso
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
