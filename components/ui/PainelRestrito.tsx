"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Painel da área restrita: entrar, ver as fichas, exportar e apagar.
 *
 * Nenhum dado de paciente existe nesta página até a senha ser aceita — a lista
 * chega da API só depois, e some da memória ao sair. Não há cache, não há
 * `localStorage`: fechar a aba já apaga tudo do navegador.
 */

type Ficha = {
  id: string;
  criadoEm: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  cidade: string;
  origem: string;
  observacao?: string;
  /** Confirmado pelo Google no cadastro. Ausente = digitado à mão, sem conferência. */
  emailVerificado?: boolean;
};

const telefoneBonito = (t: string) =>
  t.length === 11
    ? t.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    : t.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");

const cpfBonito = (c: string) => c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

const dataBonita = (iso: string) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const nascimentoBonito = (d: string) => d.split("-").reverse().join("/");

/** Diagnóstico da configuração — só chega aqui depois da senha. */
type Config = {
  chaveDeCriptografia: boolean;
  bancoConfigurado: boolean;
  bancoResponde: boolean;
  variavelEncontrada: string | null;
  versao: string;
};

export function PainelRestrito() {
  const [dentro, setDentro] = useState(false);
  const [senha, setSenha] = useState("");
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    const r = await fetch("/api/area-restrita", { cache: "no-store" });
    if (r.ok) {
      const dados = await r.json();
      setFichas(dados.fichas ?? []);
      setConfig(dados.config ?? null);
      setDentro(true);
      return true;
    }
    return false;
  }, []);

  // se o cookie da visita anterior ainda vale, entra direto
  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setOcupado(true);
    setErro("");
    try {
      const r = await fetch("/api/area-restrita", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      if (!r.ok) {
        setErro((await r.json().catch(() => ({}))).erro ?? "Não foi possível entrar.");
        return;
      }
      setSenha("");
      await carregar();
    } finally {
      setOcupado(false);
    }
  }

  async function sair() {
    await fetch("/api/area-restrita", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sair: true }),
    });
    setFichas([]);
    setDentro(false);
  }

  async function apagar(ficha: Ficha) {
    if (!confirm(`Apagar definitivamente o cadastro de ${ficha.nome}?`)) return;
    await fetch("/api/area-restrita", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: ficha.id }),
    });
    setFichas((f) => f.filter((x) => x.id !== ficha.id));
  }

  /** Exporta em CSV para abrir no Excel. O ponto e vírgula é o separador que o Excel em português espera. */
  function exportar() {
    const colunas = ["Data", "Nome", "E-mail", "E-mail verificado", "Telefone", "CPF", "Nascimento", "Cidade", "Origem", "Observação"];
    const escapar = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const linhas = fichas.map((f) =>
      [
        dataBonita(f.criadoEm),
        f.nome,
        f.email,
        f.emailVerificado ? "Sim" : "Não",
        telefoneBonito(f.telefone),
        cpfBonito(f.cpf),
        nascimentoBonito(f.nascimento),
        f.cidade,
        f.origem,
        f.observacao ?? "",
      ]
        .map(escapar)
        .join(";")
    );
    // BOM na frente: sem ele o Excel abre os acentos errados
    const csv = "﻿" + [colunas.join(";"), ...linhas].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cadastros-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!dentro) {
    return (
      <form onSubmit={entrar} className="holo glass max-w-md rounded-3xl p-7">
        <label htmlFor="senha" className="font-mono-tech mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-faint">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="glass w-full rounded-2xl px-4 py-3.5 outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] transition-all focus:ring-2 focus:ring-[var(--accent)]"
        />
        {erro && <p className="mt-3 text-[0.85rem] text-red-400">{erro}</p>}
        <button type="submit" disabled={ocupado || !senha} className="btn-primary mt-6 w-full justify-center">
          {ocupado ? "Verificando…" : "Entrar"}
        </button>
        <p className="mt-5 text-[0.78rem] leading-relaxed text-faint">
          Cinco tentativas por hora. Os cadastros ficam cifrados no banco: sem a chave, nem o
          provedor de hospedagem consegue lê-los.
        </p>
      </form>
    );
  }

  const filtradas = busca
    ? fichas.filter((f) =>
        [f.nome, f.email, f.telefone, f.cpf, f.cidade, f.origem]
          .join(" ")
          .toLowerCase()
          .includes(busca.toLowerCase())
      )
    : fichas;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por nome, telefone, cidade…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="glass min-w-0 flex-1 rounded-full px-4 py-2.5 text-[0.9rem] outline-none ring-1 ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button type="button" onClick={exportar} disabled={fichas.length === 0} className="btn-ghost !py-2.5 text-sm">
          Baixar CSV
        </button>
        <button type="button" onClick={sair} className="btn-ghost !py-2.5 text-sm">
          Sair
        </button>
      </div>

      {config && !(config.chaveDeCriptografia && config.bancoResponde) && (
        <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
          <p className="font-display font-semibold text-amber-400">
            O formulário de cadastro está fora do ar
          </p>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
            Quem entrar na página de cadastro consegue preencher, mas o envio é recusado. Falta:
          </p>
          <ul className="mt-3 space-y-1.5 text-[0.86rem]">
            {!config.chaveDeCriptografia && (
              <li>
                ❌ <strong>CADASTRO_CHAVE</strong> — criar na Vercel, em Environment Variables,
                marcando <em>Production</em>.
              </li>
            )}
            {!config.bancoConfigurado && (
              <li>
                ❌ <strong>Banco de dados</strong> — instalar o Redis em Storage e conectar ao
                projeto, com <em>Production</em> marcado.
              </li>
            )}
            {config.bancoConfigurado && !config.bancoResponde && (
              <li>
                ⚠️ <strong>O banco está configurado mas não respondeu</strong> — o token pode
                estar errado ou o banco, pausado.
              </li>
            )}
          </ul>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-faint">
            Depois de criar, é preciso um <strong>Redeploy</strong>: variáveis novas só valem em
            um deploy novo.
          </p>
        </div>
      )}

      <p className="font-mono-tech mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] uppercase tracking-[0.14em] text-faint">
        <span>
          {filtradas.length} de {fichas.length} cadastro(s)
        </span>
        {config && (
          <span title={`variável do banco: ${config.variavelEncontrada ?? "nenhuma"}`}>
            · chave {config.chaveDeCriptografia ? "ok" : "ausente"} · banco{" "}
            {config.bancoResponde ? "ok" : config.bancoConfigurado ? "sem resposta" : "ausente"} ·
            versão {config.versao}
          </span>
        )}
      </p>

      {fichas.length === 0 ? (
        <p className="mt-8 text-muted">Nenhum cadastro ainda.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {filtradas.map((f) => (
            <div key={f.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{f.nome}</p>
                  <p className="mt-0.5 text-[0.78rem] text-faint">
                    {dataBonita(f.criadoEm)} · {f.origem}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => apagar(f)}
                  className="text-[0.8rem] text-faint underline underline-offset-2 transition-colors hover:text-red-400"
                >
                  Apagar
                </button>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[0.88rem] sm:grid-cols-2">
                {[
                  ["Telefone", telefoneBonito(f.telefone), `https://wa.me/55${f.telefone}`],
                  [
                    // O visto marca o que o Google confirmou. Sem ele o endereço
                    // pode estar certo — só não foi conferido por ninguém, e é
                    // essa diferença que importa na hora de contar com o e-mail.
                    f.emailVerificado ? "E-mail ✓" : "E-mail",
                    f.email,
                    `mailto:${f.email}`,
                  ],
                  ["CPF", cpfBonito(f.cpf)],
                  ["Nascimento", nascimentoBonito(f.nascimento)],
                  ["Cidade", f.cidade],
                ].map(([rotulo, valor, link]) => (
                  <div key={rotulo as string} className="flex gap-2">
                    <dt className="shrink-0 text-faint">{rotulo}:</dt>
                    <dd className="min-w-0 break-words">
                      {link ? (
                        <a href={link as string} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-2">
                          {valor}
                        </a>
                      ) : (
                        valor
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {f.observacao && (
                <p className="mt-3 rounded-xl border hairline p-3 text-[0.86rem] leading-relaxed text-muted">
                  {f.observacao}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
