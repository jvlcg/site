"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { buscar, type ItemBusca } from "@/lib/busca-comum";

/**
 * A busca do site.
 *
 * ## Decisões que valem explicação
 *
 * **O índice chega pronto, do servidor.** São poucos quilobytes de títulos e
 * resumos que já estavam na página. Buscar no próprio navegador responde a
 * cada tecla sem ida à rede, funciona em conexão ruim e não conta a ninguém o
 * que a pessoa procurou — num site de médico, o que se busca é assunto dela.
 *
 * **O termo vai para a URL.** `/busca?q=insonia` pode ser compartilhado,
 * guardado e encontrado no histórico, e o botão "voltar" faz o que se espera.
 * Sem isso a busca existiria só enquanto a aba estivesse aberta.
 *
 * **O resultado é anunciado.** Quem usa leitor de tela não vê a lista mudar;
 * o `aria-live` diz quantos resultados apareceram. Sem ele, digitar no campo
 * não produz retorno nenhum.
 */
export function Busca({ itens, inicial = "" }: { itens: ItemBusca[]; inicial?: string }) {
  const [consulta, setConsulta] = useState(inicial);
  const campo = useRef<HTMLInputElement>(null);

  const resultados = useMemo(() => buscar(itens, consulta), [itens, consulta]);

  /*
    A URL acompanha a digitação, mas com `replaceState`: cada tecla criando
    uma entrada no histórico faria o botão "voltar" percorrer letra por letra
    o que a pessoa escreveu, em vez de sair da busca.
  */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (consulta) url.searchParams.set("q", consulta);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [consulta]);

  useEffect(() => {
    campo.current?.focus();
  }, []);

  const vazio = consulta.trim().length > 1 && resultados.length === 0;

  return (
    <div>
      <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 fill-none stroke-current stroke-2 text-faint"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={campo}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Insônia, canabidiol, telemedicina, check-up…"
          aria-label="Buscar no site"
          className="w-full bg-transparent text-lg outline-none placeholder:text-faint"
        />
      </div>

      {/*
        `aria-live="polite"` e não `assertive`: a contagem muda a cada tecla, e
        o modo assertivo interromperia a própria digitação da pessoa a cada
        letra.
      */}
      <p aria-live="polite" className="sr-only">
        {consulta.trim().length > 1
          ? `${resultados.length} resultado${resultados.length === 1 ? "" : "s"} para ${consulta}`
          : ""}
      </p>

      {resultados.length > 0 && (
        <ul className="mt-6 space-y-3">
          {resultados.map((r) => (
            <li key={r.url}>
              <Link href={r.url} className="glass card-hover block rounded-2xl p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {r.tipo}
                </p>
                <p className="font-display mt-2 font-semibold leading-snug">{r.titulo}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.resumo}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {vazio && (
        <div className="glass mt-6 rounded-2xl p-6">
          <p className="text-muted">
            Nada encontrado para <strong className="text-[var(--fg)]">{consulta}</strong>.
          </p>
          {/*
            Uma busca sem resultado não pode ser um beco. Quem procurou algo
            que o site não tem provavelmente quer falar com alguém — e é isso
            que estas duas saídas oferecem.
          */}
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Você pode ver o{" "}
            <Link href="/mapa-do-site" className="text-[var(--accent)] underline underline-offset-4">
              mapa do site
            </Link>{" "}
            com todas as páginas, ou{" "}
            <Link href="/contato" className="text-[var(--accent)] underline underline-offset-4">
              perguntar direto ao consultório
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
