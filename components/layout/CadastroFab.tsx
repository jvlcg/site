"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Atalho flutuante para o cadastro de pacientes.
 *
 * Fica acima do assistente de IA, formando uma coluna à direita:
 * WhatsApp (embaixo) → assistente → cadastro.
 *
 * O rótulo escrito aparece sozinho depois de alguns segundos e some — ícone
 * solto não diz a que veio, e um balão que fica para sempre vira ruído. Some de
 * vez assim que a pessoa toca nele ou já está na página de cadastro.
 */

const CHAVE = "cadastro-convite-visto";

export function CadastroFab() {
  const caminho = usePathname();
  const [visivel, setVisivel] = useState(false);
  const [rotulo, setRotulo] = useState(false);

  useEffect(() => {
    // aparece junto com o botão do WhatsApp, depois da primeira rolagem
    const aoRolar = () => setVisivel(window.scrollY > 420);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!visivel || localStorage.getItem(CHAVE) === "1") return;
    const abre = setTimeout(() => setRotulo(true), 2500);
    const fecha = setTimeout(() => setRotulo(false), 11000);
    return () => {
      clearTimeout(abre);
      clearTimeout(fecha);
    };
  }, [visivel]);

  // na própria página de cadastro o atalho não tem função
  if (caminho === "/cadastro") return null;

  return (
    <div
      className={`fixed bottom-[13.5rem] right-6 z-40 flex items-center gap-3 transition-all duration-500 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span
        aria-hidden="true"
        className={`glass hidden whitespace-nowrap rounded-full px-4 py-2 text-[0.8rem] font-medium shadow-lg transition-all duration-500 sm:block ${
          rotulo ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0"
        }`}
      >
        Cadastre-se e tenha canal direto
      </span>

      <Link
        href="/cadastro"
        aria-label="Cadastro de pacientes — canal direto com o consultório"
        title="Cadastro de pacientes"
        onClick={() => localStorage.setItem(CHAVE, "1")}
        className="glass relative flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-[color-mix(in_srgb,var(--accent)_45%,transparent)] transition-transform duration-300 hover:scale-110"
      >
        {/* pulso lento: chama o olho sem piscar feito propaganda */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-15 [animation-duration:3.5s]"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="relative h-6 w-6 text-[var(--accent)]"
        >
          {/* ficha de cadastro com uma estrela: identificação + condição própria */}
          <path d="M15.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
          <path d="M15 3v4.5h5" />
          <path d="m11 10.5 1.05 2.13 2.35.34-1.7 1.66.4 2.34-2.1-1.11-2.1 1.1.4-2.33-1.7-1.66 2.35-.34z" />
        </svg>
      </Link>
    </div>
  );
}
