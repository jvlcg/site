"use client";

/**
 * Template re-renderiza a cada navegação: dá uma transição de entrada suave
 * (fade + leve subida) — sensação de "câmera" entre páginas. A animação é
 * neutralizada em prefers-reduced-motion (ver globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
