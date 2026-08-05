"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { EntrarComGoogle } from "@/components/ui/EntrarComGoogle";

/**
 * Entrada do aluno num curso.
 *
 * Reaproveita o mesmo botão do cadastro de pacientes — inclusive o aviso de que
 * o Google fica sabendo, e o cuidado de só baixar o script do Google depois do
 * toque. O que muda é o destino: aqui a credencial vai para `/api/aluno`, que
 * confere a assinatura e devolve o cookie de sessão.
 *
 * `router.refresh()` no fim, e não `window.location.reload()`: o servidor
 * re-renderiza a página já enxergando o cookie, sem descarregar o que já está
 * na tela. A aula aparece no lugar do bloqueio, sem piscar a página inteira.
 */
export function EntrarAluno({ curso, motivo }: { curso: string; motivo: string }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [estado, setEstado] = useState<"parado" | "entrando" | "erro">("parado");

  return (
    <div className="glass rounded-2xl p-6 sm:p-7">
      <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
        Conteúdo de aluno
      </p>
      <h2 className="font-display mt-2.5 text-xl font-semibold">{motivo}</h2>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
        A conta serve só para o curso: guarda seu nome e e-mail, e nada mais.
        Ela <strong className="text-[var(--fg)]">não dá acesso a dados de
        paciente</strong> e não tem relação com o seu atendimento no
        consultório.
      </p>

      <div className="mt-5">
        <EntrarComGoogle
          escuro={resolvedTheme === "dark"}
          /*
            Mensagem própria: aqui o Google é o único caminho, e a padrão manda
            preencher campos que não existem nesta tela. Aponta a causa mais
            comum, que é bloqueador de anúncio ou extensão de privacidade
            barrando `accounts.google.com` — e dá duas saídas que a pessoa
            consegue tentar sozinha.
          */
          alternativa={
            <>
              O botão do Google não carregou. Quase sempre é{" "}
              <strong className="text-[var(--fg)]">bloqueador de anúncios ou
              extensão de privacidade</strong> barrando o acesso ao Google
              nesta página. Tente desativar a extensão só para este site, ou
              abrir numa janela anônima. Se continuar, me chame pelo WhatsApp
              que eu libero seu acesso na mão.
            </>
          }
          aoIdentificar={async ({ credencial }) => {
            setEstado("entrando");
            try {
              const r = await fetch("/api/aluno", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ credencial, curso }),
              });
              if (!r.ok) return setEstado("erro");
              router.refresh();
            } catch {
              setEstado("erro");
            }
          }}
        />
      </div>

      {estado === "entrando" && <p className="mt-3 text-[0.84rem] text-faint">Entrando…</p>}
      {estado === "erro" && (
        <p role="alert" className="mt-3 text-[0.84rem] text-red-400">
          Não foi possível entrar agora. Tente de novo daqui a pouco.
        </p>
      )}
    </div>
  );
}
