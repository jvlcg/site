"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * O bloco que oferece o material de apoio em troca do cadastro gratuito.
 *
 * ## Por que é componente de navegador, e não de servidor
 *
 * A primeira versão lia o cookie no servidor para saber se mostrava "baixar"
 * ou "criar conta". Funcionava — e tirava a página inteira do cache estático,
 * porque ler cookie torna a rota dinâmica.
 *
 * `/medicina-esportiva` é página de busca local: é por ela que alguém chega
 * procurando médico do esporte em Goiânia. Trocar o carregamento instantâneo
 * de todas essas visitas por um botão que muda de rótulo para as poucas que
 * já têm conta é um mau negócio.
 *
 * Aqui o bloco é servido estático com o convite, e o botão de baixar aparece
 * um instante depois para quem estiver logado. A página volta a ser `○` no
 * build.
 *
 * ## O que este material pode ser, e o que não pode
 *
 * Educativo e geral. Um PDF de médico com plano de treino ou dieta
 * personalizada seria conduta sem avaliação — o documento em si viraria o
 * problema, independentemente de quem o baixou. O que está no arquivo são
 * princípios, faixas de referência e sinais de alarme, com ressalvas em cada
 * seção e o CRM no rodapé de todas as páginas.
 */

const TOPICOS = [
  "A ordem de importância: o que pesa muito e o que quase não pesa",
  "Quanto treinar, e por que força deixa de ser opcional depois dos 30",
  "Proteína, fibras e o que não precisa — incluindo suplementos",
  "Quando procurar um médico antes de começar",
];

export function MaterialGratuito() {
  const [temConta, setTemConta] = useState<boolean | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/aluno")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && setTemConta(!!d?.aluno))
      .catch(() => vivo && setTemConta(false));
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <section className="glass rounded-3xl p-7 sm:p-9">
      <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">
        Material gratuito
      </p>
      <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
        Treino e alimentação: princípios que valem para quase todo mundo
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        Um guia de quatro páginas sobre o que a evidência sustenta — e sobre o
        que ela não sustenta. Sem dieta pronta, sem plano de treino e sem
        promessa: a hierarquia do que realmente muda resultado, as faixas de
        referência que costumam ser erradas para baixo, e os sinais que pedem
        para parar o exercício e procurar atendimento.
      </p>

      <ul className="mt-5 space-y-2">
        {TOPICOS.map((item) => (
          <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
            {item}
          </li>
        ))}
      </ul>

      {/*
        Altura reservada com `min-h`. Sem ela, o botão trocando de rótulo
        quando a resposta chega empurraria o aviso de baixo — salto de layout
        numa página que o Google mede.
      */}
      <div className="mt-7 min-h-[92px]">
        {temConta ? (
          <a
            href="/api/material/treino-e-alimentacao"
            className="btn-primary"
            /*
              `download` é dica, não garantia — o `Content-Disposition` da rota
              é quem manda. Está aqui para o navegador não abrir o PDF numa
              aba, o que no celular costuma dar em tela branca.
            */
            download
          >
            Baixar o PDF <span aria-hidden="true">↓</span>
          </a>
        ) : (
          <>
            <Link href="/minha-conta" className="btn-primary">
              {temConta === null ? "Baixar o material" : "Criar conta e baixar"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-4 text-[0.8rem] leading-relaxed text-faint">
              A conta é gratuita e leva um toque — entra com a sua conta do
              Google, e o site guarda só nome e e-mail. Não dá acesso a nenhum
              dado clínico e não é agendamento.
            </p>
          </>
        )}
      </div>

      <p className="mt-6 border-t hairline pt-5 text-[0.8rem] leading-relaxed text-faint">
        Conteúdo educativo. Não é prescrição, não avalia caso individual e não
        substitui consulta. Se você tem doença crônica, usa medicação contínua,
        está grávida ou sente dor ao se exercitar, converse com um médico antes
        de mudar rotina de treino ou de alimentação.
      </p>
    </section>
  );
}
