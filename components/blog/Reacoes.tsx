"use client";

import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";
import { LIMITE_TEXTO, type Comentario } from "@/lib/interacoes";
import { repartirComLinks } from "@/lib/auto-links";

/**
 * Reações e comentários no fim do post.
 *
 * ## Por que tudo carrega depois, e não junto com a página
 *
 * O post é estático (SSG) e é assim que ele fica rápido no Google. Contagem de
 * joinha e lista de comentários mudam a toda hora — pedi-los durante a
 * geração congelaria números velhos no HTML, e pedi-los no servidor a cada
 * visita transformaria uma página estática em dinâmica, jogando fora o cache
 * da borda no artigo inteiro por causa de um bloco no rodapé.
 *
 * Buscando pelo navegador, o artigo continua estático e só este bloco é
 * dinâmico.
 *
 * ## Quando o banco não está configurado
 *
 * O bloco inteiro some. A rota responde `disponivel: false` e aqui isso vira
 * "não renderiza nada" — quem lê o artigo não tem o que fazer com um aviso de
 * infraestrutura, e um esqueleto vazio de comentários passa a impressão de que
 * o site quebrou.
 */

type Dados = {
  disponivel: boolean;
  positivos: number;
  negativos: number;
  meu: 1 | -1 | null;
  comentarios: Comentario[];
};

export function Reacoes({ slug }: { slug: string }) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [texto, setTexto] = useState("");
  const [nome, setNome] = useState("");
  const [aviso, setAviso] = useState("");
  /** Separa "deu certo" de "foi recusado" — muda só a cor do aviso. */
  const [recusado, setRecusado] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((d: Dados) => vivo && setDados(d))
      .catch(() => {
        /* rede fora: o bloco simplesmente não aparece */
      });
    return () => {
      vivo = false;
    };
  }, [slug]);

  const votar = useCallback(
    async (voto: 1 | -1) => {
      if (!dados) return;
      /*
        Atualiza a tela antes da resposta do servidor.

        O gesto é um clique único e o resultado é um número: esperar a viagem
        de rede para ver o próprio joinha acender faz o botão parecer quebrado
        em conexão lenta, que é justamente onde está a maior parte das visitas.
        Se a chamada falhar, o estado volta ao que era.
      */
      const antes = dados;
      const desfazendo = dados.meu === voto;
      setDados({
        ...dados,
        meu: desfazendo ? null : voto,
        positivos:
          dados.positivos +
          (voto === 1 ? (desfazendo ? -1 : 1) : dados.meu === 1 ? -1 : 0),
        negativos:
          dados.negativos +
          (voto === -1 ? (desfazendo ? -1 : 1) : dados.meu === -1 ? -1 : 0),
      });
      try {
        const r = await fetch(`/api/posts/${slug}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ acao: "voto", voto }),
        });
        if (!r.ok) throw new Error();
        const novo = (await r.json()) as Omit<Dados, "disponivel" | "comentarios">;
        setDados((d) => (d ? { ...d, ...novo } : d));
      } catch {
        setDados(antes);
      }
    },
    [dados, slug]
  );

  const enviar = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (texto.trim().length < 2 || enviando) return;
      setEnviando(true);
      setAviso("");
      try {
        const r = await fetch(`/api/posts/${slug}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ acao: "comentario", texto, nome }),
        });
        /*
          O 422 é a recusa do filtro de palavras, e vem com o motivo escrito.
          Ele merece tratamento próprio: dizer "não consegui enviar" a quem
          xingou faria a pessoa tentar de novo achando que foi falha de rede.
        */
        if (r.status === 422) {
          const d = (await r.json()) as { motivo?: string };
          setAviso(d.motivo ?? "Esse comentário não pode ser publicado assim.");
          setRecusado(true);
          return;
        }
        if (!r.ok) throw new Error();
        setTexto("");
        setRecusado(false);
        setAviso(
          "Recebido. Seu comentário aparece assim que o Dr. José Victor revisar — em site de médico, tudo que é público passa por leitura antes."
        );
      } catch {
        setRecusado(true);
        setAviso("Não consegui enviar agora. Tente de novo em instantes.");
      } finally {
        setEnviando(false);
      }
    },
    [texto, nome, slug, enviando]
  );

  if (!dados?.disponivel) return null;

  return (
    <section className="mx-auto mt-20 max-w-3xl px-5 sm:px-8" aria-labelledby="reacoes-titulo">
      <h2 id="reacoes-titulo" className="font-display text-xl font-semibold tracking-tight">
        Este texto te ajudou?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Sua resposta orienta os próximos assuntos. Não precisa ter conta.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <BotaoVoto
          ativo={dados.meu === 1}
          rotulo="Sim, ajudou"
          contagem={dados.positivos}
          onClick={() => votar(1)}
          icone="M7 11v9H3v-9h4Zm4-8 4 6h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18.8 20H9V11l2-8Z"
        />
        <BotaoVoto
          ativo={dados.meu === -1}
          rotulo="Nem tanto"
          contagem={dados.negativos}
          onClick={() => votar(-1)}
          espelhado
          icone="M7 11v9H3v-9h4Zm4-8 4 6h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18.8 20H9V11l2-8Z"
        />
      </div>

      <h3 className="font-display mt-14 text-xl font-semibold tracking-tight">
        Comentários
        {dados.comentarios.length > 0 && (
          <span className="ml-2 text-base font-normal text-faint">
            {dados.comentarios.length}
          </span>
        )}
      </h3>

      <form onSubmit={enviar} className="mt-5">
        <label htmlFor="comentario" className="sr-only">
          Seu comentário
        </label>
        <textarea
          id="comentario"
          ref={area}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={LIMITE_TEXTO}
          rows={4}
          placeholder="Escreva sua dúvida ou comentário sobre o texto."
          className="w-full resize-y rounded-2xl border hairline bg-transparent p-4 text-[0.95rem] leading-relaxed outline-none transition-colors focus:border-[var(--accent)]"
        />
        {/*
          O aviso não é burocracia: sem ele, alguém descreve o próprio caso
          achando que está falando com o médico. O canal é público e o lugar
          da dúvida clínica é a consulta.
        */}
        <p className="mt-2 text-xs leading-relaxed text-faint">
          Comentário é público e passa por revisão antes de aparecer. Não escreva aqui
          dados de saúde, exames ou informações pessoais — para o seu caso, a conversa é
          na consulta.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="nome-comentario" className="sr-only">
            Como quer assinar
          </label>
          <input
            id="nome-comentario"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={60}
            placeholder="Como quer assinar (opcional)"
            className="min-w-0 flex-1 rounded-full border hairline bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={enviando || texto.trim().length < 2}
            className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            {enviando ? "Enviando…" : "Comentar"}
          </button>
        </div>
        {aviso && (
          <p
            role="status"
            className={`mt-3 text-sm leading-relaxed ${
              recusado ? "text-amber-500" : "text-[var(--accent)]"
            }`}
          >
            {aviso}
          </p>
        )}
      </form>

      {dados.comentarios.length > 0 && (
        <ul className="mt-10 space-y-6">
          {dados.comentarios.map((c) => (
            <li key={c.id} className="border-l-2 pl-5" style={{ borderColor: "var(--line)" }}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm font-semibold">{c.nome || "Anônimo"}</span>
                {c.aluno && (
                  <span className="font-mono-tech rounded-full border hairline px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                    cadastrado
                  </span>
                )}
                <time dateTime={c.criadoEm} className="text-xs text-faint">
                  {new Date(c.criadoEm).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              {/* `whitespace-pre-line` preserva as quebras que a pessoa escreveu */}
              <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted">
                <TextoComLinks texto={c.texto} slug={slug} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BotaoVoto({
  ativo,
  rotulo,
  contagem,
  onClick,
  icone,
  espelhado = false,
}: {
  ativo: boolean;
  rotulo: string;
  contagem: number;
  onClick: () => void;
  icone: string;
  espelhado?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
        ativo
          ? "border-[var(--accent)] text-[var(--accent)]"
          : "hairline text-muted hover:text-[var(--fg)]"
      }`}
      style={ativo ? { background: "var(--accent-soft)" } : undefined}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[1.05rem] w-[1.05rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        style={espelhado ? { transform: "rotate(180deg)" } : undefined}
      >
        <path d={icone} />
      </svg>
      {rotulo}
      {contagem > 0 && (
        <span className="font-mono-tech text-xs tabular-nums opacity-70">{contagem}</span>
      )}
    </button>
  );
}

/**
 * O texto do comentário, com as menções a assuntos do site virando link.
 *
 * ## Duas decisões que este trecho toma, e o motivo de cada uma
 *
 * **Só link INTERNO, e só a partir da nossa lista.** Nada do que a pessoa
 * escreveu vira link para fora. Transformar `http://…` digitado por um
 * visitante em link clicável num site de médico é abrir uma porta de spam com
 * a credibilidade do consultório atrás — e é o vetor número um de abuso em
 * qualquer caixa de comentário aberta.
 *
 * **Teto de dois, e não os seis do artigo.** Um comentário tem duas ou três
 * frases; seis links ali seriam mais link do que texto, e o comentário do
 * leitor viraria vitrine. Dois bastam para levar quem perguntou até a página
 * que responde.
 *
 * O conjunto `jaUsados` é criado por comentário, e não compartilhado entre
 * eles: cada comentário é um texto independente, e o segundo não deve perder
 * o link porque o primeiro já usou aquele destino.
 */
function TextoComLinks({ texto, slug }: { texto: string; slug: string }) {
  const trechos = repartirComLinks(texto, new Set<string>(), `/blog/${slug}`, 2);
  return (
    <>
      {trechos.map((t, i) =>
        t.href ? (
          <Link key={i} href={t.href} className="underline underline-offset-2 hover:text-[var(--accent)]">
            {t.texto}
          </Link>
        ) : (
          <span key={i}>{t.texto}</span>
        )
      )}
    </>
  );
}
