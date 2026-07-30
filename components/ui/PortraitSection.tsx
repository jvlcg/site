import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Parallax } from "./Parallax";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  image: string;
  alt: string;
  /** Foto à esquerda (padrão) ou à direita. */
  reverse?: boolean;
  children?: React.ReactNode;
};

/**
 * Bloco editorial reutilizável: retrato com moldura glass + parallax ao lado
 * de um texto. Empilha no mobile, lado a lado a partir de lg.
 */
export function PortraitSection({
  eyebrow,
  title,
  lede,
  image,
  alt,
  reverse = false,
  children,
}: Props) {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal
          className={`relative mx-auto w-full max-w-md ${
            reverse ? "order-1 lg:order-2" : "order-1"
          }`}
        >
          <div className="glass overflow-hidden rounded-[1.8rem] p-2">
            <div className="overflow-hidden rounded-[1.4rem]">
              <Parallax speed={0.13}>
                <Image
                  src={image}
                  alt={alt}
                  width={650}
                  height={975}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="scale-[1.1] rounded-[1.4rem] object-cover"
                />
              </Parallax>
            </div>
          </div>
        </Reveal>

        <div className={reverse ? "order-2 lg:order-1" : "order-2"}>
          <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
