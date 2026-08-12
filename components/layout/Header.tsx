"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoLockup } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { ContaAluno } from "@/components/ui/ContaAluno";
import { whatsappLink } from "@/lib/site-config";

/*
  Cada item carrega a cor do assunto da própria página (`cor`), definida em
  globals.css como um par de tons — um para o tema claro, outro para o escuro.
  Ver o comentário do bloco `--nav-*` lá: os dois tons são o que mantém o texto
  legível, não enfeite.
*/
const headerLinks = [
  { href: "/sobre", label: "Sobre", cor: "--nav-sobre" },
  /* Rótulo curto no topo: "Cannabis Medicinal" inteiro não cabe entre os doze
     itens, e a página se identifica sozinha assim que abre. */
  { href: "/cannabis-medicinal", label: "Cannabis", cor: "--nav-cannabis" },
  { href: "/clinica-medica", label: "Clínica Médica", cor: "--nav-clinica" },
  { href: "/medicina-esportiva", label: "Esportiva", cor: "--nav-esportiva" },
  { href: "/telemedicina", label: "Telemedicina", cor: "--nav-telemedicina" },
  { href: "/consultorio", label: "Consultório", cor: "--nav-consultorio" },
  { href: "/cursos", label: "Cursos", cor: "--nav-cursos" },
  { href: "/blog", label: "Blog", cor: "--nav-blog" },
  /*
    "Artigos" (a produção científica) sai do topo e fica no rodapé, no mapa do
    site e no link dentro da página Sobre, que é de onde a maioria chega nela.
    É o item de menor uso entre os doze, e o menu precisava de espaço: sem
    isso o botão de agendar passava da faixa do cabeçalho e desalinhava com o
    conteúdo da página.
  */
  { href: "/perguntas-frequentes", label: "FAQ", cor: "--nav-faq" },
  { href: "/poemas", label: "Poemas", cor: "--nav-poemas" },
  { href: "/contato", label: "Contato", cor: "--nav-contato" },
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

  /*
    Trava a rolagem e avisa o resto da página que o menu está aberto.

    O atributo é lido só pelo CSS (`html[data-menu="aberto"]` em globals.css),
    que tira da frente os botões flutuantes — mascotes, assistente, cadastro e
    WhatsApp. Sem isso, em 390 px o balão do mascote fica por cima do último
    item da lista e cobre o "Contato".
  */
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.style.overflow = open ? "hidden" : "";
    if (open) raiz.dataset.menu = "aberto";
    else delete raiz.dataset.menu;
    return () => {
      raiz.style.overflow = "";
      delete raiz.dataset.menu;
    };
  }, [open]);

  return (
    /*
      Fragmento, e não um só `<header>` envolvendo tudo.

      O menu de toque **precisa** ficar fora do `<header>`, e o motivo é um dos
      cantos mais escorregadios do CSS: ao rolar, o cabeçalho ganha
      `backdrop-filter` para o efeito de vidro — e `backdrop-filter` faz o
      elemento virar **bloco de referência** para todo `position: fixed` que
      esteja dentro dele.

      Com o menu como filho, ele deixava de se medir pela tela e passava a se
      medir pela barra de 72 px. `top: 72px` com `bottom: 0` dentro de uma
      caixa de 72 px dá **altura zero**. Medido: 772 px de altura no topo da
      página, 0 px depois de rolar.

      Era exatamente o sintoma relatado — o menu "só abre quando estou no topo".
    */
    <>
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
      {/*
        Margem lateral menor no celular (16 px em vez de 20 px). São 8 px de
        largura útil, e nesta barra 8 px decidem se o menu cabe.
      */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 min-[1500px]:max-w-[1440px]">
        {/*
          Sem `aria-label` aqui, de propósito. O nome deste link vem do texto
          dentro dele — ver a explicação no `LogoLockup`. Um `aria-label`
          **substitui** o texto visível como nome do elemento, e era isso que
          quebrava a navegação por comando de voz: a pessoa via "Dr.JV", dizia
          "clicar em Dr.JV", e o nome do link era outro.
        */}
        <Link href="/">
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
                /*
                  A cor da página vem do token; o "você está aqui" deixou de ser
                  cor (agora todo item tem uma) e passou a ser **peso e fundo**,
                  que continuam distinguindo o item ativo mesmo para quem não
                  separa bem as cores — cerca de 8% dos homens.
                */
                style={{ color: `var(${link.cor})` }}
                /*
                  Sem `opacity` no estado de repouso, por mais discreto que
                  ficasse: opacidade rebaixa o contraste medido, e a medição
                  abaixo foi feita na cor cheia. 0,78 rem já é texto pequeno.
                */
                className={`whitespace-nowrap rounded-full px-1.5 py-2 text-[0.78rem] transition-all hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)] ${
                  active ? "bg-[color-mix(in_srgb,currentColor_14%,transparent)] font-semibold" : ""
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
        <div className="flex items-center gap-1 sm:gap-3">
          {/*
            Só a partir de 1500 px, que é onde o menu de toque some e a barra
            deixa de disputar espaço. Abaixo disso a busca está no menu — pôr
            mais um botão de 40 px aqui é o que fazia o menu ser cortado em
            320 px, e sem menu o site fica sem navegação nenhuma.
          */}
          <Link
            href="/busca"
            aria-label="Buscar no site"
            className="glass hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-[var(--accent)] min-[1500px]:flex"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[1.05rem] w-[1.05rem] fill-none stroke-current stroke-2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
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
            className="btn-primary whitespace-nowrap !px-3 !py-2.5 text-sm sm:!px-5"
          >
            {/*
              O rótulo curto vai até 768 px, e não até 640.

              Medido: em 640 px a linha terminava em 695 — "Agendar consulta"
              inteiro não cabe ali junto do resto. O ponto de corte estava
              otimista.
            */}
            <span className="md:hidden">Agendar</span>
            <span className="hidden md:inline">Agendar consulta</span>
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
    </header>

      {/*
        Menu de toque — irmão do cabeçalho, nunca filho. Ver a explicação
        acima; mexer nisto reintroduz o defeito.

        `z-40` contra os `z-50` do cabeçalho: a barra fica por cima, e é o que
        mantém o botão de fechar alcançável com o menu aberto.
      */}
      <div
        className={`fixed inset-0 top-[72px] z-40 transition-all duration-500 min-[1500px]:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "var(--bg)" }}
      >
        <nav aria-label="Navegação móvel" className="flex h-full flex-col gap-1 overflow-y-auto px-6 pt-6 pb-10">
          {/*
            A busca abre o menu, e não a barra do topo.

            A barra já está no limite: os comentários acima registram medições
            em 320 e 640 px, onde cada 4 px decide se o menu ainda cabe. Abaixo
            de 1500 px é aqui que mora toda a navegação, então é aqui que quem
            procura algo vem olhar.
          */}
          <Link
            href="/busca"
            onClick={() => setOpen(false)}
            className={`mb-2 flex items-center gap-3 rounded-2xl border hairline px-4 py-3.5 text-muted transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? "60ms" : "0ms" }}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[1.15rem] w-[1.15rem] shrink-0 fill-none stroke-current stroke-2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            Buscar no site
          </Link>
          {headerLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b hairline py-4 font-display text-2xl font-medium transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              /* Mesma cor por página do menu do topo. Aqui o texto tem 1,5 rem,
                 então a folga de contraste é ainda maior que a medida. */
              style={{
                color: `var(${link.cor})`,
                transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
              }}
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
    </>
  );
}
