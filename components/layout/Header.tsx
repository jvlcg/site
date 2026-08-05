"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLockup } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { ContaAluno } from "@/components/ui/ContaAluno";
import { whatsappLink } from "@/lib/site-config";

const headerLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/medicina-endocanabinoide", label: "Endocanabinoide" },
  { href: "/clinica-medica", label: "Clínica Médica" },
  { href: "/medicina-esportiva", label: "Esportiva" },
  { href: "/telemedicina", label: "Telemedicina" },
  { href: "/consultorio", label: "Consultório" },
  { href: "/cursos", label: "Cursos" },
  { href: "/blog", label: "Blog" },
  /*
    "Artigos" (a produção científica) sai do topo e fica no rodapé, no mapa do
    site e no link dentro da página Sobre, que é de onde a maioria chega nela.
    É o item de menor uso entre os doze, e o menu precisava de espaço: sem
    isso o botão de agendar passava da faixa do cabeçalho e desalinhava com o
    conteúdo da página.
  */
  { href: "/perguntas-frequentes", label: "FAQ" },
  { href: "/poemas", label: "Poemas" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b hairline backdrop-blur-xl" : ""
      }`}
      style={{ background: scrolled ? "var(--header-bg)" : "transparent" }}
    >
      {/*
        A faixa do cabeçalho passa de 1280 para 1440 px onde o menu horizontal
        aparece — o conteúdo das páginas continua em 1280.

        Não é capricho: com doze itens de menu, a marca e o botão de agendar, o
        cabeçalho tinha 7 px de folga. Qualquer coisa nova ali empurraria de
        novo o botão de agendar para fora, que foi exatamente o defeito
        corrigido antes. Cabeçalho mais largo que o texto é comum e não
        atrapalha a leitura: ninguém lê o menu como parágrafo.
      */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 min-[1500px]:max-w-[1440px]">
        <Link href="/" aria-label="Página inicial — Dr. José Victor Lisboa Cardoso Gomes">
          <LogoLockup compact />
        </Link>

        {/*
          O menu horizontal só aparece a partir de 1400px, e não de 1280.

          Com doze itens ele não cabe em 1280 junto com a marca e o botão de
          agendar: o excesso não quebra linha (os itens têm `whitespace-nowrap`)
          nem encolhe — ele transborda, e quem sai da tela é o botão da direita.
          Ou seja, o menu crescendo empurrava para fora justamente o botão que
          traz paciente.

          Abaixo de 1400 o menu de toque assume, e ele comporta qualquer número
          de itens porque rola. Trocar o ponto de corte custa o menu horizontal
          em telas de 1280 a 1400 e devolve o botão de agendar em todas elas —
          uma troca fácil de fazer.
        */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-0 min-[1500px]:flex"
        >
          {headerLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-1.5 py-2 text-[0.78rem] transition-colors ${
                  active ? "text-[var(--accent)]" : "text-muted hover:text-[var(--fg)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/*
          Espaçamento menor no celular. Com marca, conta, dois alternadores, o
          botão de agendar e o menu na mesma linha, cada 4 px de folga por
          intervalo decide se o último elemento cabe — e o último é o menu.
        */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ContaAluno />
          {/*
            O som some abaixo de 360 px.

            É o item de menor uso da barra e o único com equivalente no menu de
            toque, com rótulo e tudo. Medido: em 320 px a linha terminava em
            378 e o menu era cortado — num aparelho onde o menu é a única
            navegação, isso deixa o site sem saída.
          */}
          <span className="hidden min-[360px]:flex">
            <SoundToggle />
          </span>
          <ThemeToggle />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            /*
              Sem `hidden md:inline-flex` aqui, e o motivo é um bug que
              encontrei: `.btn-primary` define `display: inline-flex` em CSS
              comum, fora das camadas do Tailwind, e por isso **vence a classe
              `hidden`**. O botão estava marcado para sumir no celular e
              aparecia assim mesmo — a classe era uma mentira silenciosa.

              Em vez de forçar a barra com `!hidden`, aceito o comportamento
              real, que aliás é o desejável: o botão de agendar é o que traz
              paciente, e escondê-lo no celular era o erro. O que muda é o
              rótulo, que encurta para caber ao lado dos outros.
            */
            className="btn-primary whitespace-nowrap !px-4 !py-2.5 text-sm sm:!px-5"
          >
            <span className="sm:hidden">Agendar</span>
            <span className="hidden sm:inline">Agendar consulta</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="glass flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full min-[1500px]:hidden"
          >
            <span
              className={`h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[3.25px] rotate-45" : ""}`}
            />
            <span
              className={`h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* menu mobile */}
      <div
        className={`fixed inset-0 top-[72px] z-40 transition-all duration-500 min-[1500px]:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "var(--bg)" }}
      >
        <nav aria-label="Navegação móvel" className="flex h-full flex-col gap-1 overflow-y-auto px-6 pt-6 pb-10">
          {headerLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b hairline py-4 font-display text-2xl font-medium transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
          {/* alternador com rótulo: em tela de toque não há hover para revelar o ícone */}
          <div
            className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: open ? `${80 + headerLinks.length * 45}ms` : "0ms" }}
          >
            <ThemeToggle variant="row" />
            <SoundToggle variant="row" />
          </div>
          <ContaAluno variant="linha" />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-primary mt-8 justify-center transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "480ms" : "0ms" }}
          >
            Agendar consulta pelo WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
