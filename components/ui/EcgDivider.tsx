"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Divisor com linha de ECG animada — assinatura médico-tech entre seções.
 *
 * A animação usa `stroke-dashoffset`, que a GPU não compõe: cada quadro faz o
 * navegador repintar na thread principal. Num laço infinito, e com o divisor
 * repetido em várias seções, isso custava enquanto a pessoa lia — inclusive
 * bem longe do divisor, que nem estava na tela.
 *
 * Então ele só anima quando aparece. O CSS deixa a animação `paused` e o
 * observador aqui liga e desliga conforme entra e sai do viewport — sem
 * `once`, de propósito: sair da tela precisa pausar de novo, senão o custo
 * volta a ser permanente depois da primeira passagem.
 *
 * Visualmente nada muda: ninguém vê um divisor que está fora da tela.
 */
export function EcgDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [emCena, setEmCena] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEmCena(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mx-auto my-8 max-w-7xl px-5 sm:px-8 ${emCena ? "em-cena" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 40" className="h-8 w-full" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="20" x2="1200" y2="20" stroke="var(--line)" strokeWidth="1.2" className="ecg-line" />
        <path
          d="M0 20 H480 l14 -13 l12 26 l16 -34 l14 41 l12 -20 H1200"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-pulse"
        />
      </svg>
    </div>
  );
}
