import { NIVEIS, nivelDe, type Conta } from "@/lib/pontos";
import { site } from "@/lib/site-config";
import { CopiarLink } from "./CopiarLink";

/**
 * O placar do aluno: nível, pontos e o link de indicação.
 *
 * ## O aviso que não é letra miúda
 *
 * "Valem só dentro do site" aparece em texto normal, não em rodapé cinza. É a
 * diferença entre um programa de cortesia e algo que pareça moeda — e a
 * segunda coisa é regulada. Vale para quem lê e vale para quem audita.
 *
 * ## Por que não há ranking público
 *
 * A tentação óbvia num sistema de pontos é mostrar os primeiros colocados.
 * Aqui isso significaria publicar que fulano é paciente ou aluno de um médico
 * — e, dependendo do curso, insinuar a condição de saúde dele. Não existe
 * versão segura disso num site de consultório.
 */
export function MeusPontos({ conta }: { conta: Conta }) {
  const nivel = nivelDe(conta.total);
  const link = `${site.url}/r/${conta.codigo}`;
  const progresso = nivel.proximo
    ? Math.min(100, Math.round(((conta.total - nivel.minimo) / (nivel.proximo.minimo - nivel.minimo)) * 100))
    : 100;

  return (
    <section className="glass rounded-2xl p-6 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono-tech text-[0.66rem] uppercase tracking-[0.16em] text-faint">
            Seu nível
          </p>
          <p className="font-display mt-1.5 text-2xl font-semibold text-[var(--accent)]">
            {nivel.nome}
          </p>
        </div>
        <p className="font-mono-tech text-[0.72rem] uppercase tracking-[0.14em] text-muted">
          {conta.total} pontos
        </p>
      </div>

      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{nivel.beneficio}</p>

      {nivel.proximo && (
        <div className="mt-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_12%,transparent)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="mt-2 text-[0.8rem] text-faint">
            Faltam <strong className="text-[var(--fg)]">{nivel.faltam} pontos</strong> para{" "}
            {nivel.proximo.nome} — {nivel.proximo.beneficio.toLowerCase()}.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------- indicação */}
      <div className="mt-7 border-t hairline pt-6">
        <p className="font-display text-[0.95rem] font-semibold">Seu link de indicação</p>
        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">
          Quem se cadastrar por este link soma pontos para você. O link é seu e
          não muda.
        </p>
        <p className="font-mono-tech mt-3 break-all rounded-xl border hairline px-4 py-3 text-[0.86rem]">
          {link}
        </p>
        <CopiarLink link={link} />
      </div>

      {/* ---------------------------------------------------- extrato */}
      {conta.eventos.length > 0 && (
        <div className="mt-7 border-t hairline pt-6">
          <p className="font-display text-[0.95rem] font-semibold">Como você somou</p>
          <ul className="mt-3 space-y-2">
            {conta.eventos.slice(0, 8).map((e, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 text-[0.86rem]">
                <span className="min-w-0 text-muted">
                  {ROTULOS[e.tipo] ?? e.tipo}
                  {e.nota && <span className="text-faint"> · {e.nota}</span>}
                </span>
                <span className="font-mono-tech shrink-0 text-[0.78rem] text-[var(--accent)]">
                  +{e.pontos}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------------------------------------------- os níveis */}
      <div className="mt-7 border-t hairline pt-6">
        <p className="font-display text-[0.95rem] font-semibold">Os níveis</p>
        <ul className="mt-3 space-y-2.5">
          {NIVEIS.map((n) => (
            <li key={n.nome} className="flex gap-3 text-[0.84rem] leading-relaxed">
              <span
                className={`font-mono-tech w-16 shrink-0 text-[0.7rem] uppercase tracking-[0.12em] ${
                  conta.total >= n.minimo ? "text-[var(--accent)]" : "text-faint"
                }`}
              >
                {n.nome}
              </span>
              <span className="text-muted">{n.beneficio}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 rounded-xl border hairline p-4 text-[0.8rem] leading-relaxed text-muted">
        Os pontos são uma cortesia do consultório e{" "}
        <strong className="text-[var(--fg)]">
          valem apenas dentro deste site
        </strong>
        . Não são dinheiro, não têm valor de troca, não podem ser vendidos,
        transferidos ou convertidos, e não geram direito a atendimento,
        prioridade de agenda ou qualquer vantagem clínica. As recompensas são
        de conteúdo. O consultório pode ajustar a tabela a qualquer momento —
        pontos já lançados nunca são retirados.
      </p>
    </section>
  );
}

const ROTULOS: Record<string, string> = {
  contaCriada: "Conta criada",
  cadastroCompleto: "Cadastro preenchido",
  indicacaoConfirmada: "Indicação confirmada",
  cursoConcluido: "Curso concluído",
  reconhecimento: "Reconhecimento do consultório",
};
