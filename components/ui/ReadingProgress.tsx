"use client";

import { useEffect, useState } from "react";

/** Barra fina de progresso de leitura no topo (artigos). */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        transform: `scaleX(${progress / 100})`,
        background: "linear-gradient(90deg, var(--color-accent-500), var(--color-teal-flow))",
      }}
      aria-hidden="true"
    />
  );
}
