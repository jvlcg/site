import Link from "next/link";
import { alunoAtual } from "@/lib/aluno";

/**
 * Um trecho de artigo que só quem tem conta lê.
 *
 * Uso dentro do `.mdx`:
 *
 * ```mdx
 * <SoParaAlunos>
 * Este parágrafo só aparece para quem entrou.
 * </SoParaAlunos>
 * ```
 *
 * ## O que **não** pode ir aqui dentro
 *
 * Nada que a pessoa precise para cuidar da própria saúde. Sinal de alarme,
 * quando procurar um médico, o que é seguro e o que não é — isso é orientação
 * essencial, e cobrar cadastro por ela é problema de ética médica, não de
 * produto. O que cabe aqui é **aprofundamento**: o detalhe do mecanismo, o
 * estudo por trás, o roteiro prático, o exemplo passo a passo.
 *
 * Um artigo em que o trecho fechado é a parte que importa é um artigo mal
 * dividido.
 *
 * ## Por que isto não é cloaking
 *
 * Cloaking é mostrar ao Google uma página e ao visitante outra — penalidade de
 * indexação, não advertência. Aqui o rastreador vê exatamente o que um
 * visitante deslogado vê: o mesmo aviso de conteúdo restrito, no mesmo lugar.
 * Ninguém é enganado.
 *
 * O que declara isso ao Google é o `hasPart` com `isAccessibleForFree: false`
 * apontando para a classe `.trecho-restrito` — montado em
 * `app/blog/[slug]/page.tsx`. É o mesmo mecanismo que jornais usam, e existe
 * justamente para que conteúdo fechado possa ser indexado sem punição.
 *
 * **A classe é contrato, não estilo.** Se ela mudar aqui, tem de mudar lá — do
 * contrário o Google passa a ver conteúdo escondido sem declaração, que é
 * exatamente o caso que ele pune.
 */
export async function SoParaAlunos({ children }: { children: React.ReactNode }) {
  const aluno = await alunoAtual();

  if (aluno) {
    return (
      <div className="trecho-restrito relative my-8 rounded-2xl border-l-2 border-[color-mix(in_oklab,var(--accent)_50%,transparent)] pl-5 sm:pl-6">
        <p className="font-mono-tech mb-3 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          Conteúdo de aluno
        </p>
        {children}
      </div>
    );
  }

  return (
    <div className="trecho-restrito glass my-8 rounded-2xl p-6 sm:p-7">
      <p className="font-mono-tech text-[0.64rem] uppercase tracking-[0.16em] text-faint">
        Continua para quem tem conta
      </p>
      <p className="font-display mt-2.5 text-lg font-semibold">
        Esta parte é um aprofundamento
      </p>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
        O restante do artigo — inclusive tudo o que você precisa saber sobre
        quando procurar ajuda — está aberto e continua abaixo. Este trecho traz
        o detalhe extra, e abre com a conta gratuita.
      </p>
      <Link href="/minha-conta" className="btn-primary mt-5 !py-2.5 text-sm">
        Entrar ou criar conta <span aria-hidden="true">→</span>
      </Link>
      <p className="mt-3.5 text-[0.76rem] leading-relaxed text-faint">
        A conta é gratuita, usa sua conta do Google e guarda apenas nome e
        e-mail. Não dá acesso a nenhum dado clínico.
      </p>
    </div>
  );
}
