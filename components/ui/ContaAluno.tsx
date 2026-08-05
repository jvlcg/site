"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * A entrada da conta de aluno, no cabeçalho.
 *
 * Enquanto ninguém está logado, é um link discreto para os cursos, que é onde
 * a conta faz sentido — não adianta oferecer "Entrar" a quem não tem nada para
 * ver do lado de dentro. Depois de logado, vira o primeiro nome da pessoa,
 * levando à área dela.
 *
 * ## Por que busca no cliente, e não no servidor
 *
 * Saber quem está logado exige ler o cookie, e ler cookie torna a rota
 * dinâmica. O cabeçalho aparece em **todas** as páginas: fazer isso no servidor
 * tiraria o site inteiro do cache estático para exibir um nome — trocaria a
 * velocidade de todas as visitas por um detalhe que interessa a poucas.
 *
 * Buscando depois que a página já está na tela, o HTML continua estático e
 * cacheável, e quem está logado vê o nome aparecer um instante depois. É o
 * lado certo da troca.
 *
 * ## Por que o espaço não muda
 *
 * O botão tem largura mínima fixa. Sem isso, o nome chegando depois empurraria
 * o resto do cabeçalho para o lado — salto de layout, que conta contra o site
 * no Core Web Vitals e incomoda mesmo quando não conta.
 */

type Aluno = { nome: string; email: string };

/** Rotas onde a conta não vem ao caso, e o cabeçalho já está cheio. */
const SEM_CONTA = ["/area-restrita", "/agendar"];

export function ContaAluno({ variant = "topo" }: { variant?: "topo" | "linha" }) {
  const caminho = usePathname();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch("/api/aluno")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo) return;
        setAluno(d?.aluno ?? null);
        setCarregou(true);
      })
      .catch(() => vivo && setCarregou(true));
    return () => {
      vivo = false;
    };
    // refaz na troca de rota: entrar num curso muda quem está logado
  }, [caminho]);

  if (SEM_CONTA.some((r) => caminho.startsWith(r))) return null;

  const primeiroNome = aluno?.nome?.split(" ")[0] ?? "Minha conta";

  if (variant === "linha") {
    /* Dentro do menu de toque, onde há espaço e o rótulo pode ser inteiro. */
    return (
      <Link
        href={aluno ? "/minha-conta" : "/cursos"}
        className="border-b hairline py-4 font-display text-2xl font-medium"
      >
        {aluno ? `Minha conta · ${primeiroNome}` : "Entrar"}
      </Link>
    );
  }

  return (
    <Link
      href={aluno ? "/minha-conta" : "/cursos"}
      /*
        `min-w` fixo reserva o espaço antes de saber quem é. Sem ele, o nome
        chegando depois da resposta empurraria os botões vizinhos.
      */
      className="glass hidden min-w-[104px] items-center justify-center gap-2 rounded-full px-3.5 py-2 text-[0.78rem] font-medium transition-colors hover:text-[var(--accent)] md:inline-flex"
      title={aluno ? `Entrou como ${aluno.email}` : "Entrar na área de cursos"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c0-3.4 3.1-5.5 7-5.5s7 2.1 7 5.5" />
      </svg>
      {/*
        Antes da resposta o rótulo fica vazio, e não "Entrar". Mostrar "Entrar"
        e trocar por um nome meio segundo depois pisca a informação errada na
        cara de quem já está logado.
      */}
      <span className="truncate">{carregou ? (aluno ? primeiroNome : "Entrar") : ""}</span>
    </Link>
  );
}
