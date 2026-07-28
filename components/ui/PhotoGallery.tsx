"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/gallery";

/**
 * Galeria responsiva com lightbox. As fotos alternam entre a unidade e o
 * médico, para que o paciente conheça o espaço e quem o atende ao mesmo tempo.
 * Navegação por teclado (setas/Esc) e por toque (swipe).
 */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close, next, prev]);

  // swipe no mobile
  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => {
          // alterna alturas para dar ritmo visual (efeito editorial)
          const tall = i % 5 === 0 || i % 7 === 3;
          return (
            <li
              key={p.src}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 4) * 70}ms` }}
              className={tall ? "row-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Ampliar foto: ${p.caption}`}
                className="holo glass group relative block h-full w-full overflow-hidden rounded-2xl p-0 text-left"
              >
                <span className={`block overflow-hidden rounded-2xl ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10">
                  <span className="font-mono-tech block text-[0.68rem] uppercase tracking-[0.14em] text-white/90">
                    {p.caption}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[open].alt}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (dx > 60) prev();
            else if (dx < -60) next();
            setTouchX(null);
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Foto anterior"
            className="glass absolute left-4 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white sm:left-8"
          >
            ‹
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[open].src}
              alt={photos[open].alt}
              width={photos[open].width}
              height={photos[open].height}
              sizes="90vw"
              className="max-h-[78vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/80">
              {photos[open].caption}
              <span className="mx-2 opacity-40">·</span>
              <span className="font-mono-tech text-xs opacity-70">
                {open + 1}/{photos.length}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Próxima foto"
            className="glass absolute right-4 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white sm:right-8"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
