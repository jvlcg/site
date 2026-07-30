"use client";

import { useEffect, useRef } from "react";

/**
 * Halo de luz sutil que segue o cursor (só desktop / ponteiro fino). Reforça a
 * sensação "tech" sem atrapalhar leitura. Desativa em toque e reduced-motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;
    el.style.opacity = "1";
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden opacity-0 transition-opacity duration-700 lg:block"
      style={{
        width: 460,
        height: 460,
        marginLeft: -230,
        marginTop: -230,
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--accent) 16%, transparent), transparent 62%)",
        filter: "blur(28px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
