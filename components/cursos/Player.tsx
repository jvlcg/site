import type { Video } from "@/content/cursos";

/**
 * O quadro do vídeo.
 *
 * Proporção fixa de 16:9 pelo `aspect-video`, e não altura calculada em
 * JavaScript: o espaço já fica reservado no primeiro desenho da página, então
 * o texto abaixo não pula quando o vídeo carrega. Salto de layout conta contra
 * o site no Core Web Vitals, e é irritante mesmo quando não conta.
 */
export function Player({ video, titulo }: { video: Video; titulo: string }) {
  if (video.tipo === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border hairline bg-black">
        <iframe
          /*
            `youtube-nocookie.com` no lugar do domínio normal: o YouTube só
            grava cookie de rastreamento depois que a pessoa dá play, em vez de
            no carregamento da página. Numa aula de saúde isso importa — quem
            só abriu e leu o texto não vira dado de audiência.
          */
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
          title={titulo}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  /**
   * Vídeo protegido ainda sem serviço configurado.
   *
   * Aparece assim em vez de quebrar: o curso continua navegável, a lista de
   * aulas continua de pé, e a falta fica explícita para quem está montando o
   * conteúdo. Ver `content/plano-cursos.md`, etapa do serviço de vídeo.
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
