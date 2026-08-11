import Image from "next/image";

/**
 * Faixa de fotografia de largura total, entre uma seção e outra.
 *
 * ## Para que serve
 *
 * Duas coisas ao mesmo tempo. A primeira é respiro: uma página de texto
 * corrido cansa, e uma imagem grande no meio funciona como parágrafo em
 * branco — o olho descansa e volta.
 *
 * A segunda é usar o que estava parado. Havia cinco retratos profissionais no
 * repositório sem uso nenhum, enquanto as páginas repetiam o mesmo cartão de
 * vidro. Fotografia é o ativo mais caro de produzir e o mais barato de
 * aproveitar.
 *
 * ## Por que sai da caixa do conteúdo
 *
 * `w-screen` com deslocamento de metade da largura: a faixa atravessa a tela
 * inteira, enquanto o texto ao redor continua na coluna de leitura. É o
 * contraste entre os dois que dá a sensação de escala — uma foto grande
 * dentro da mesma coluna do texto seria só uma foto grande.
 *
 * `left: 50%` com `margin-left: -50vw` em vez de `position: absolute`: assim
 * ela continua ocupando altura no fluxo, e o que vem depois não sobe por
 * baixo dela.
 *
 * ## O texto sobre a imagem
 *
 * Opcional, e curto quando existe. Sobre foto, texto longo obriga a escurecer
 * a imagem inteira para garantir contraste — e aí não vale mais a pena ter
 * posto a foto. Uma linha basta e cabe no degradê de baixo, que é onde a
 * imagem costuma ter menos informação.
 */

type Props = {
  src: string;
  alt: string;
  /** Uma linha, no máximo. Ver a nota acima. */
  legenda?: string;
  /** Altura da faixa. `alta` para virada de capítulo, `media` para respiro. */
  altura?: "media" | "alta";
  /**
   * Onde a imagem se ancora ao ser cortada.
   *
   * Importa mais do que parece: em retrato vertical dentro de faixa larga, o
   * padrão (`center`) corta a cabeça. `topo` é quase sempre o certo para
   * pessoas.
   */
  ancora?: "topo" | "centro" | "baixo";
};

export function FaixaFoto({ src, alt, legenda, altura = "media", ancora = "topo" }: Props) {
  const alturas = {
    media: "h-[18rem] sm:h-[24rem]",
    alta: "h-[24rem] sm:h-[34rem]",
  };
  const ancoras = {
    topo: "object-top",
    centro: "object-center",
    baixo: "object-bottom",
  };

  return (
    <div
      className={`foto-revela relative left-1/2 my-24 w-screen -translate-x-1/2 ${alturas[altura]}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={`object-cover ${ancoras[ancora]}`}
      />
      {legenda && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(6,14,20,0.88) 0%, rgba(6,14,20,0.35) 34%, transparent 62%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 sm:px-8 sm:pb-10">
            {/*
              Branco fixo, e não `--fg`: o texto pousa sobre foto escurecida
              nos dois temas. No tema claro, `--fg` é quase preto e sumiria
              dentro do degradê.
            */}
            <p className="display-apple max-w-2xl text-xl text-white sm:text-2xl">{legenda}</p>
          </div>
        </>
      )}
    </div>
  );
}
