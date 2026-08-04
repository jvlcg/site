import QRCode from "qrcode";
import { brCode } from "@/lib/pix";
import { site } from "@/lib/site-config";
import { CopiarPix } from "./CopiarPix";

/**
 * Bloco de doação por PIX das aulas gratuitas.
 *
 * O QR é gerado **no servidor, durante o build**, como SVG embutido no HTML.
 * Três consequências, e todas importam aqui:
 *
 * - não há JavaScript de terceiro na página, então ninguém de fora fica
 *   sabendo quem viu a aula;
 * - não há chamada de rede nenhuma para desenhar o código, então ele aparece
 *   junto com o resto da página, sem piscar;
 * - o SVG é vetorial, então funciona igual em qualquer tela e não pesa.
 *
 * Doação por PIX não passa por intermediário: o dinheiro vai direto da conta de
 * quem doa para a de quem recebe, sem taxa e sem gateway. É por isso que este
 * bloco não depende de nenhum serviço externo estar no ar.
 */

type Props = {
  /** Aparece no extrato, para saber a que se refere a entrada. */
  referencia?: string;
};

export async function DoacaoPix({ referencia = "APOIOCONTEUDO" }: Props) {
  const codigo = brCode({
    chave: site.pixChave,
    nome: site.pixNome,
    cidade: site.address.city,
    referencia,
  });

  const svg = await QRCode.toString(codigo, {
    type: "svg",
    margin: 1,
    // Nível M corrige até 15% do código danificado. O padrão do PIX aceita, e
    // subir para o nível alto engrossaria o desenho sem ganho real numa tela.
    errorCorrectionLevel: "M",
  });

  return (
    <section className="glass rounded-2xl p-6 sm:p-7">
      <p className="font-mono-tech text-[0.68rem] uppercase tracking-[0.16em] text-faint">
        Conteúdo gratuito
      </p>
      <h2 className="font-display mt-2.5 text-xl font-semibold">
        Se este material te ajudou
      </h2>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
        A doação é voluntária e serve para produzir mais aulas abertas. Não dá
        acesso a nada além do que já está aqui, não gera vínculo com o
        consultório e não substitui consulta.
      </p>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {/*
          Fundo branco fixo, e não a cor do tema: leitor de QR precisa de
          contraste escuro sobre claro, e no modo escuro um QR invertido
          simplesmente não é lido por boa parte dos aplicativos de banco.
        */}
        <div
          className="shrink-0 rounded-xl bg-white p-3"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: svg.replace("<svg", '<svg width="148" height="148"') }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[0.82rem] text-faint">Chave PIX</p>
          <p className="mt-1 break-all font-mono-tech text-[0.9rem]">{site.pixChave}</p>
          <CopiarPix codigo={codigo} />
          <p className="mt-3 text-[0.78rem] leading-relaxed text-faint">
            Aponte a câmera do aplicativo do seu banco para o código, ou use o
            “copia e cola”. O valor é você quem escolhe.
          </p>
        </div>
      </div>
    </section>
  );
}
