import { Reveal } from "./Reveal";
import { TextoRevela } from "./TextoRevela";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
};

/**
 * Título de seção — o componente mais reutilizado do site.
 *
 * Por isso ele é o ponto certo para pôr a revelação palavra a palavra: uma
 * mudança aqui alcança quase todas as seções de quase todas as páginas, sem
 * tocar em nenhuma delas.
 */
export function SectionHeading({ eyebrow, title, lede, align = "left" }: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal as="p" className={`eyebrow mb-4 ${align === "center" ? "justify-center" : ""}`}>
          {eyebrow}
        </Reveal>
      )}
      {/*
        Título maior e com espacejamento mais apertado, na mesma medida do
        `display-apple` dos heróis — para que a hierarquia do site inteiro
        fale a mesma língua.
      */}
      <Reveal as="h2" delay={60} className="display-apple text-[2rem] sm:text-[2.6rem] lg:text-[3.1rem]">
        {title}
      </Reveal>
      {lede && (
        /*
          A linha de apoio acende palavra a palavra conforme sobe na tela.

          Sem `Reveal` por fora: os dois animam opacidade e brigariam entre si
          — o bloco inteiro aparecendo de uma vez anularia justamente o efeito
          de as palavras acenderem em sequência.
        */
        <TextoRevela className="mt-5 text-lg leading-relaxed text-muted">{lede}</TextoRevela>
      )}
    </div>
  );
}
