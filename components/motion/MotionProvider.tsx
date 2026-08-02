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

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return <>{children}</>;
}
