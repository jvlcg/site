"use client";

import { useRef, useState } from "react";
import type { Video } from "@/content/cursos";
import { Capa } from "./Capa";

/**
 * O quadro do vídeo, em duas etapas: capa primeiro, player só no clique.
 *
 * ## Por que não um iframe direto
 *
 * O iframe do YouTube custa cerca de **1,2 MB e meio segundo de thread
 * principal** — e cobra isso de todo mundo que abre a página, inclusive de
 * quem só passou os olhos no texto e foi embora. Num curso com dez aulas
 * listadas, isso é o site inteiro travando por vídeo que ninguém pediu.
 *
 * Aqui a página carrega uma imagem (uns 15 KB) e um botão. O iframe entra no
 * primeiro clique, já com `autoplay`, então quem quer assistir não perde nada:
 * o clique que abriria o vídeo é o mesmo que o carrega. É o padrão que o
 * próprio Lighthouse recomenda quando aponta "third-party resources can be
 * lazy loaded with a facade".
 *
 * ## Por que `hqdefault` e não `maxresdefault`
 *
 * `maxresdefault` é maior, mas **só existe se o vídeo foi enviado em HD** — em
 * qualquer outro caso o endereço devolve 404 e o quadro fica cinza. Como a
 * falha aparece só depois de publicar, e só em alguns vídeos, é o tipo de bug
 * que passa despercebido por semanas.
 *
 * `hqdefault` existe sempre. Ele vem em 4:3 com tarjas pretas em cima e
 * embaixo, e é exatamente por isso que o `object-cover` funciona: ele corta o
 * que sobra, e o que sobra são as tarjas. Sobra o quadro 16:9 limpo.
 *
 * Quem quiser capa própria usa o campo `capa` da aula.
 *
 * ## O `preconnect` no hover
 *
 * Passar o mouse sobre a capa já abre a conexão com o YouTube. Quando o clique
 * vem — e ele vem, quem passa o mouse costuma clicar — o aperto de mão de rede
 * já aconteceu, e o vídeo começa uns 200 ms antes. Não custa nada a quem não
 * clica: `preconnect` só abre a conexão, não baixa nada.
 */

const CAPA_PADRAO = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type Props = {
  video: Video;
  titulo: string;
  /** Capa própria. Sem ela, usa a miniatura do YouTube. */
  capa?: string;
};

export function Player({ video, titulo, capa }: Props) {
  const [tocando, setTocando] = useState(false);
  const aqueceu = useRef(false);

  if (video.tipo !== "youtube") {
    /**
     * Vídeo protegido ainda sem serviço configurado.
     *
     * Aparece assim em vez de quebrar: o curso continua navegável e a falta
     * fica explícita para quem monta o conteúdo. Ver `content/plano-cursos.md`.
     */
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border hairline p-8 text-center">
        <p className="max-w-sm text-[0.88rem] leading-relaxed text-faint">
          Este vídeo está hospedado em serviço protegido, que ainda não foi
          configurado. O conteúdo aparece assim que o serviço for ligado.
        </p>
      </div>
    );
  }

  const aquecer = () => {
    if (aqueceu.current) return;
    aqueceu.current = true;
    for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
      const l = document.createElement("link");
      l.rel = "preconnect";
      l.href = href;
      document.head.appendChild(l);
    }
  };

  /**
   * Saída para quando o quadro do vídeo não abre.
   *
   * Bloqueador de anúncios, extensão de privacidade e DNS filtrado barram
   * `youtube-nocookie.com` — e o navegador troca o vídeo por uma caixa cinza
   * dizendo "este conteúdo está bloqueado, contacte o proprietário do site".
   * Quem lê isso conclui que o site está quebrado; não tem como saber que o
   * bloqueio saiu do próprio aparelho.
   *
   * **Tentei detectar o bloqueio e não consegui.** A ideia era ler o
   * `contentDocument` do quadro: em iframe de outra origem o acesso lança, e a
   * ausência da exceção denunciaria a página de erro. Medido nos dois cenários,
   * o Chrome mantém a origem do alvo mesmo com o pedido abortado, e o teste não
   * distinguiu vídeo tocando de vídeo barrado.
   *
   * Detecção que erra é pior que nenhuma: um falso positivo esconderia atrás de
   * um aviso de erro um vídeo que está tocando. Então o caminho é o que não
   * depende de adivinhar — o link fica **sempre** visível, com peso suficiente
   * para ser achado por quem está olhando para um quadro que não abriu.
   */
  const escapatoria = (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] leading-relaxed text-muted">
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost !py-1.5 !px-3.5 text-[0.8rem]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-1.5 h-4 w-4 fill-current">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </svg>
        Assistir no YouTube
      </a>
      <span className="text-[0.78rem] text-faint">
        se o quadro acima não abrir — bloqueador de anúncios costuma barrar.
      </span>
    </p>
  );

  if (tocando) {
    return (
      <>
      <div className="aspect-video w-full overflow-hidden rounded-2xl border hairline bg-black">
        <iframe
          /*
            `youtube-nocookie.com`: o YouTube só grava cookie de rastreamento
            depois do play, em vez de no carregamento. Combinado com a capa, o
            resultado é que **quem não assiste não é registrado por eles**.
          */
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      {escapatoria}
      </>
    );
  }

  return (
    <>
    <button
      type="button"
      onClick={() => setTocando(true)}
      onMouseEnter={aquecer}
      onFocus={aquecer}
      onTouchStart={aquecer}
      aria-label={`Assistir: ${titulo}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border hairline bg-[color-mix(in_srgb,var(--fg)_7%,var(--bg))]"
    >
      <Capa
        src={capa ?? CAPA_PADRAO(video.id)}
        titulo={titulo}
        eager
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg transition-transform duration-300 group-hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--bg)]">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
    {escapatoria}
    </>
  );
}
