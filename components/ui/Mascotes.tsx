"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ESTETO, TERMO } from "@/content/mascotes";
import { Estetoscopio } from "./Estetoscopio";
import { Mascote } from "./Mascote";
import { Termometro } from "./Termometro";

/**
 * Quem entra em cena, quando, e onde.
 *
 * São dois personagens com o mesmo comportamento, e a única coisa que muda
 * entre computador e celular é **quantos aparecem de uma vez**.
 *
 * ## No computador: os dois, um acima do outro, em fila
 *
 * O Termô fica em cima e o Estetô embaixo, numa coluna ancorada no canto. Mas
 * eles **não falam ao mesmo tempo**: o Termô só entra depois que o Estetô
 * termina de falar (ou é fechado). Dois balões digitando juntos seriam duas
 * vozes sobrepostas — e, do lado técnico, duas digitações concorrendo pela
 * mesma thread.
 *
 * ## No celular: um de cada vez, revezando
 *
 * Numa tela de telefone, dois balões empilhados cobrem o que a pessoa está
 * lendo — que é justamente o oposto do que um convite deveria fazer. Então
 * aparece **um por carregamento**, no mesmo canto, e eles se revezam: quem
 * apareceu desta vez cede a vez na próxima página.
 *
 * O revezamento é contado fora do React, porque o estado se perde na troca de
 * rota e é exatamente entre uma página e outra que a vez precisa ser lembrada.
 */

/**
 * De quem é a vez no celular.
 *
 * Guardado no navegador, e não numa variável do módulo. Variável de módulo
 * sobrevive à navegação dentro do site, mas morre em qualquer recarga — e
 * recarga é como a maior parte das visitas de celular começa. Medido: com
 * variável de módulo, dois carregamentos seguidos traziam o Estetô as duas
 * vezes, porque o contador nascia zerado a cada um.
 *
 * `localStorage` porque a alternância deve valer entre visitas, não só dentro
 * de uma. É um número, sem nada que identifique ninguém — não é dado pessoal e
 * não entra na conta da LGPD.
 */
const CHAVE_VEZ = "mascote-vez";

function proximaVez(): "esteto" | "termo" {
  try {
    const anterior = Number(localStorage.getItem(CHAVE_VEZ) ?? "");
    /**
     * Quem chega pela primeira vez começa em um dos dois, por sorteio.
     * Começar sempre no Estetô faria o Termô nunca aparecer para quem visita
     * o site uma vez só — que é a maioria.
     */
    const n = Number.isFinite(anterior) && anterior > 0 ? anterior + 1 : Math.floor(Math.random() * 2) + 1;
    localStorage.setItem(CHAVE_VEZ, String(n));
    return n % 2 === 1 ? "esteto" : "termo";
  } catch {
    // navegação anônima com armazenamento bloqueado: sorteia e segue
    return Math.random() < 0.5 ? "esteto" : "termo";
  }
}

export function Mascotes() {
  const caminho = usePathname();
  /**
   * `null` enquanto não se sabe. O primeiro desenho no servidor não tem como
   * saber o tipo de tela, e chutar faria o mascote errado piscar antes de ser
   * substituído.
   */
  const [noCelular, setNoCelular] = useState<boolean | null>(null);
  const [estetoSaiu, setEstetoSaiu] = useState(false);
  const [daVez, setDaVez] = useState<"esteto" | "termo">("esteto");

  useEffect(() => {
    const consulta = window.matchMedia("(pointer: coarse)");
    setNoCelular(consulta.matches);
    const aoMudar = (e: MediaQueryListEvent) => setNoCelular(e.matches);
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  /** A cada página, o revezamento anda uma casa e o Estetô volta ao início. */
  useEffect(() => {
    setEstetoSaiu(false);
    setDaVez(proximaVez());
  }, [caminho]);

  if (noCelular === null) return null;

  return (
    /*
      Uma coluna ancorada no canto, e não dois elementos fixos independentes.
      Com `fixed` em cada um eu teria de calcular a altura do de baixo para
      posicionar o de cima — e essa altura muda conforme o texto, o tamanho da
      fonte e a presença dos botões. Numa coluna, eles se empilham sozinhos.

      Entram pelo canto esquerdo porque o direito já tem WhatsApp, assistente e
      o atalho do cadastro — mais um ali viraria uma parede de botões.
    */
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-2.5 sm:bottom-6 sm:left-6">
      <div className="pointer-events-auto contents">
        {noCelular ? (
          daVez === "esteto" ? (
            <Mascote personagem={ESTETO} Desenho={Estetoscopio} />
          ) : (
            <Mascote personagem={TERMO} Desenho={Termometro} />
          )
        ) : (
          <>
            {/*
              O Termô vem primeiro no HTML e por isso aparece em cima. Ele só é
              ativado depois que o Estetô sai de cena, e com dois segundos de
              respiro — entrar no instante seguinte pareceria enxurrada.
            */}
            <Mascote
              personagem={TERMO}
              Desenho={Termometro}
              ativo={estetoSaiu}
              esperaSegundos={2}
            />
            <Mascote
              personagem={ESTETO}
              Desenho={Estetoscopio}
              aoSair={() => setEstetoSaiu(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}
