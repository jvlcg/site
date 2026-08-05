"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A miniatura de uma aula.
 *
 * ## Por que ela precisa de um plano B
 *
 * A imagem vem de `i.ytimg.com`. Bloqueador de anúncios, extensão de
 * privacidade e DNS filtrado em rede corporativa barram esse domínio junto com
 * o resto do Google — e o navegador não avisa: fica um retângulo vazio, ou o
 * ícone de imagem quebrada, exatamente onde deveria haver o convite para
 * assistir.
 *
 * Com o `onError`, a falha vira um cartaz desenhado pelo próprio site: mesmo
 * formato, mesma moldura, com o título da aula escrito. Quem não consegue ver
 * a miniatura ainda entende o que tem ali e continua navegando.
 *
 * `<img>` puro, e não `next/image`: a miniatura vem de domínio externo e passar
 * pelo otimizador da Vercel custaria uma transformação cobrada por imagem,
 * para encolher um arquivo que já é pequeno e já vem da CDN do Google.
 */
export function Capa({
  src,
  titulo,
  className = "",
  eager = false,
}: {
  src?: string;
  titulo: string;
  className?: string;
  /** `true` na capa principal da aula, que é o maior elemento da tela. */
  eager?: boolean;
}) {
  const [falhou, setFalhou] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  /**
   * Confere na montagem se a imagem já falhou — e este é o passo que faz a
   * coisa toda funcionar de verdade.
   *
   * O HTML chega pronto do servidor e o navegador começa a baixar a imagem
   * imediatamente, **antes** de o React hidratar a página. Quando o bloqueador
   * derruba o pedido, o evento `error` acontece nesse intervalo — e o `onError`
   * do React, pendurado só depois, nunca é chamado. O resultado é o retângulo
   * preto com o ícone de imagem quebrada: exatamente o que aparecia antes deste
   * efeito existir.
   *
   * `complete` com `naturalWidth` zero é a assinatura de "terminou e não veio
   * nada" — serve tanto para o pedido bloqueado quanto para o 404.
   */
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth === 0) setFalhou(true);
  }, [src]);

  if (!src || falhou) {
    return (
      <div
        className={`flex items-center justify-center bg-[color-mix(in_srgb,var(--fg)_7%,var(--bg))] p-4 ${className}`}
      >
        <span className="line-clamp-3 text-center text-[0.72rem] font-medium leading-snug text-faint">
          {titulo}
        </span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={img}
      src={src}
      alt=""
      onError={() => setFalhou(true)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={480}
      height={360}
      className={className}
    />
  );
}
