"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Fila de comentários esperando aprovação.
 *
 * Só existe porque o comentário nasce pendente — e ele nasce pendente porque
 * este é o site de um médico. O motivo completo está em `lib/interacoes.ts`;
 * em resumo: dado de saúde escrito pela própria pessoa num campo público,
 * terceiro dando conduta debaixo de um texto assinado por médico, e a
 * responsabilidade do canal pela Resolução CFM 2.336/2023.
 *
 * O que esta tela precisa ser, e é: rápida de varrer. Cada item mostra o texto
 * inteiro (nada de "ver mais" — moderar sem ler é o mesmo que não moderar), o
 * artigo de origem e dois botões.
 */

type Pendente = {
  id: string;
  slug: string;
  titulo: string;
  nome: string;
  texto: string;
  criadoEm: string;
  aluno: boolean;
  suspeito?: boolean;
};

export function PainelModeracao() {
  const [pendentes, setPendentes] = useState<Pendente[] | null>(null);
  const [disponivel, setDisponivel] = useState(true);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch("/api/moderacao");
      if (!r.ok) throw new Error();
      const d = (await r.json()) as { disponivel: boolean; pendentes: Pendente[] };
      setDisponivel(d.disponivel);
      setPendentes(d.pendentes);
    } catch {
      setPendentes([]);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const decidir = useCallback(
    async (p: Pendente, acao: "aprovar" | "remover") => {
      setOcupado(p.id);
      try {
        const r = await fetch("/api/moderacao", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug: p.slug, id: p.id, acao }),
        });
        if (!r.ok) throw new Error();
        /*
          Tira da lista aqui em vez de recarregar tudo: recarregar reordena a
          fila embaixo do dedo de quem está moderando, e o item seguinte pula
          para onde estava o botão que a pessoa acabou de clicar.
        */
        setPendentes((atual) => (atual ?? []).filter((x) => x.id !== p.id));
      } catch {
        /* mantém na lista para tentar de novo */
      } finally {
        setOcupado(null);
      }
    },
    []
  );

  if (!disponivel) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
        <p className="font-display font-semibold text-amber-400">Banco não configurado</p>
        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
          Sem o Redis, o bloco de reações e comentários não aparece nos artigos. Nada
          quebra no site — o recurso apenas não existe até o banco ser ligado.
        </p>
      </div>
    );
  }

  if (pendentes === null) {
    return <p className="text-sm text-faint">Carregando…</p>;
  }

  if (pendentes.length === 0) {
    return (
      <div className="rounded-2xl border hairline p-8 text-center">
        <p className="font-display font-semibold">Nada na fila</p>
        <p className="mt-1.5 text-sm text-muted">
          Comentários novos aparecem aqui antes de ficarem públicos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {pendentes.length} {pendentes.length === 1 ? "comentário aguardando" : "comentários aguardando"}.
        O mais antigo vem primeiro.
      </p>
      {pendentes.map((p) => (
        <article key={p.id} className="rounded-2xl border hairline p-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-semibold">{p.nome || "Anônimo"}</span>
            {p.aluno && (
              <span className="font-mono-tech rounded-full border hairline px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                cadastrado
              </span>
            )}
            <time dateTime={p.criadoEm} className="text-xs text-faint">
              {new Date(p.criadoEm).toLocaleString("pt-BR")}
            </time>
            {/*
              Marca do filtro: não é acusação, é ordem de leitura. Costuma ser
              spam ou pedido de conduta em público — e também costuma ser
              pergunta legítima de paciente, por isso não foi recusado.
            */}
            {p.suspeito && (
              <span className="font-mono-tech rounded-full border border-amber-500/50 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-amber-500">
                ler com atenção
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-faint">
            em <strong className="font-medium">{p.titulo}</strong>
          </p>
          <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-relaxed">{p.texto}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={ocupado === p.id}
              onClick={() => decidir(p, "aprovar")}
              className="btn-primary !py-2.5 text-sm disabled:opacity-50"
            >
              Publicar
            </button>
            <button
              type="button"
              disabled={ocupado === p.id}
              onClick={() => decidir(p, "remover")}
              className="btn-ghost !py-2.5 text-sm disabled:opacity-50"
            >
              Descartar
            </button>
            <a
              href={`/blog/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-center text-sm text-faint underline underline-offset-4 hover:text-[var(--fg)]"
            >
              Ver o artigo ↗
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
