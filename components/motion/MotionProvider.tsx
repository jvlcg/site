"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Smooth scrolling (Lenis) + reveals progressivos por IntersectionObserver.
 * Tudo é desativado quando o usuário prefere movimento reduzido — o conteúdo
 * permanece 100% acessível sem JS (os estilos de reveal só ativam com
 * .reveal-ready no <html>).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    document.documentElement.classList.add("reveal-ready");

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;

    /**
     * Rolagem suave só no computador.
     *
     * O Lenis mantém um `requestAnimationFrame` vivo **o tempo todo**, mesmo
     * com a página parada: a cada quadro ele acorda, calcula e devolve a vez.
     * Num aparelho modesto isso é trabalho constante na thread principal, e
     * some com qualquer momento ocioso — inclusive durante o carregamento, que
     * é o que o Lighthouse mede.
     *
     * E no celular ele não acrescenta nada: iOS e Android já entregam rolagem
     * com inércia, feita pelo compositor, fora da thread principal. Trocar o
     * que o sistema faz de graça por um laço em JavaScript é pagar caro para
     * ficar igual ou pior.
     *
     * No computador o ganho é real — a rolagem do mouse é em degraus — e lá
     * sobra thread. Então lá ele fica.
     */
    if (window.matchMedia("(pointer: fine)").matches) {
      import("lenis").then(({ default: Lenis }) => {
        lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
        const loop = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    /*
      Mesmo motivo do `ThreeScene` — e aqui o estrago seria o maior dos três:
      é esta callback que revela o conteúdo ao rolar. Se ela levanta na
      primeira entrada, o laço para e as seções seguintes **ficam invisíveis**.
    */
    let io: IntersectionObserver | null = null;
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));

    /*
      Rede de segurança para quando a página abre JÁ ROLADA.

      O IntersectionObserver resolve o caso comum — a pessoa rola e o conteúdo
      aparece —, mas erra num caso real: **salto instantâneo de rolagem**. É o
      que acontece quando o navegador restaura a posição ao recarregar, quando
      alguém volta pelo botão do histórico, e ao seguir um link com âncora.

      Medido em 390 px, saltando direto para y=4200:

        salto instantâneo            título fica em opacity 0
        mesma posição, rolando aos poucos   título aparece normalmente
        12 px de rolagem depois do salto    título aparece

      Ou seja, ele se cura no primeiro movimento do dedo — mas até lá há texto
      invisível na tela, e quem recarrega no meio de um artigo vê um buraco.

      A varredura abaixo roda uma vez, no quadro seguinte à montagem, e revela
      o que já está visível. Custa uma leitura de posição por elemento, uma
      única vez, e só faz algo quando a página não abriu no topo.
    */
    const varrerAgora = () => {
      if (window.scrollY < 40) return; // abriu no topo: o observador dá conta
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const visivel = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (visivel > 0 && visivel >= Math.min(r.height, window.innerHeight) * 0.08) {
          el.classList.add("is-visible");
          io?.unobserve(el);
        }
      }
    };
    /*
      Três passadas, e não uma.

      A primeira versão varria só no quadro seguinte à montagem, e não
      resolveu: medido, a posição de rolagem ainda não tinha se assentado ali
      — a restauração do navegador, a hidratação do React e a partida do
      Lenis acontecem em ordens diferentes conforme o aparelho e a conexão.
      Cravar um instante único é apostar numa corrida.

      Três leituras espalhadas pelos dois primeiros segundos cobrem qualquer
      ordem sem precisar adivinhar qual delas venceu. Cada passada é uma
      leitura de posição por elemento e para de fazer efeito assim que o
      elemento é revelado — não há laço nem custo contínuo.
    */
    const quadro = requestAnimationFrame(varrerAgora);
    const relogios = [300, 900, 2000].map((ms) => window.setTimeout(varrerAgora, ms));
    /*
      `pageshow` cobre a volta pelo histórico com a página inteira restaurada
      da memória (bfcache). Nesse caso nem o efeito remonta — só este evento
      avisa que a página voltou à tela.
    */
    window.addEventListener("pageshow", varrerAgora);

    return () => {
      cancelAnimationFrame(quadro);
      relogios.forEach(clearTimeout);
      window.removeEventListener("pageshow", varrerAgora);
      io.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
