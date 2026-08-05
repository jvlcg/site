"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ESTETO, TERMO } from "@/content/mascotes";
import { Estetoscopio } from "./Estetoscopio";
import { Mascote } from "./Mascote";
import { Termometro } from "./Termometro";

/**
 * Quem entra em cena, quando, e até quando.
 *
 * ## A regra que manda em tudo: recusa é resposta
 *
 * Fechar um mascote no X, ou clicar em "Agora não", é uma resposta — e uma
 * resposta merece ser lembrada. Quem disse não ao Estetô **não vê o Estetô de
 * novo** nas páginas seguintes; vê o Termô, que ainda não perguntou nada. Quem
 * disser não aos dois não vê mais nenhum.
 *
 * Sem isso, um convite recusado voltaria a cada página, e um convite que
 * insiste depois do "não" deixa de ser convite.
 *
 * **Clicar no botão do convite não é recusa.** Quem foi ao cadastro ou aos
 * cursos aceitou; o personagem só sai de cena porque já cumpriu o que tinha a
 * fazer, e continua disponível depois.
 *
 * ## Quanto tempo a recusa dura
 *
 * A visita inteira, e não para sempre — `sessionStorage`, que se apaga quando
 * a aba fecha. É o equilíbrio entre duas coisas legítimas: o pedido do Dr.
 * José Victor de que eles apareçam em toda visita, e o direito de quem já
 * disse não de não ser perguntado de novo no mesmo passeio pelo site.
 *
 * ## Quantos aparecem: depende do tamanho da tela
 *
 * **No computador, os dois juntos**, empilhados no canto, em toda página. Cabe
 * folgado e é o que o Dr. José Victor quer: quem chega vê as duas ofertas — a
 * consulta e os cursos — sem depender de ficar meio minuto na mesma página.
 *
 * **No celular, um de cada vez**, alternando o tempo de tela no mesmo canto.
 * Ali um balão já ocupa boa parte da largura; dois seriam uma parede na frente
 * do conteúdo, e é justamente o que se pediu para evitar.
 *
 * As entradas são **escalonadas** mesmo no computador — o segundo entra alguns
 * segundos depois do primeiro. Os dois digitando ao mesmo tempo seriam duas
 * vozes sobrepostas, e ninguém lê duas frases sendo escritas em paralelo. Com
 * o intervalo, os dois ficam na tela juntos e cada um fala na sua vez.
 */

const CHAVE_NEGADOS = "mascote-negados";
const CHAVE_VEZ = "mascote-vez";

type Nome = "esteto" | "termo";

function lerNegados(): Nome[] {
  try {
    return (sessionStorage.getItem(CHAVE_NEGADOS) ?? "").split(",").filter(Boolean) as Nome[];
  } catch {
    // navegação anônima com armazenamento bloqueado: ninguém recusou nada
    return [];
  }
}

function gravarNegados(lista: Nome[]) {
  try {
    sessionStorage.setItem(CHAVE_NEGADOS, lista.join(","));
  } catch {
    /* sem armazenamento, a recusa vale só até a próxima página */
  }
}

/**
 * De quem é a vez, contado no navegador.
 *
 * `localStorage` e não variável de módulo: variável sobrevive à navegação
 * dentro do site, mas morre em qualquer recarga — e recarga é como a maior
 * parte das visitas de celular começa. Medido: com variável de módulo, dois
 * carregamentos seguidos traziam o Estetô as duas vezes.
 *
 * É um número, sem nada que identifique ninguém.
 */
function proximaVez(): Nome {
  try {
    const anterior = Number(localStorage.getItem(CHAVE_VEZ) ?? "");
    /**
     * Quem chega pela primeira vez começa em um dos dois, por sorteio.
     * Começar sempre no Estetô faria o Termô nunca aparecer para quem visita
     * o site uma vez só — que é a maioria.
     */
    const n =
      Number.isFinite(anterior) && anterior > 0
        ? anterior + 1
        : Math.floor(Math.random() * 2) + 1;
    localStorage.setItem(CHAVE_VEZ, String(n));
    return n % 2 === 1 ? "esteto" : "termo";
  } catch {
    return Math.random() < 0.5 ? "esteto" : "termo";
  }
}

export function Mascotes() {
  const caminho = usePathname();
  /**
   * `null` enquanto não se sabe. O primeiro desenho acontece antes de o
   * navegador poder ser consultado, e mostrar alguém nesse instante poderia
   * exibir justamente quem já foi recusado.
   */
  const [negados, setNegados] = useState<Nome[] | null>(null);
  const [emCena, setEmCena] = useState<Nome | null>(null);
  /**
   * Cabem os dois na tela ao mesmo tempo? `null` enquanto não se sabe.
   *
   * A pergunta é de espaço, não de aparelho: o que decide é a largura útil.
   * Um tablet deitado comporta os dois; o mesmo tablet em pé, não. Por isso a
   * consulta é por `min-width` e não por `pointer`.
   *
   * Fica em estado, e não lido direto na renderização, porque o servidor não
   * tem tela — decidir na hora do HTML entregaria uma resposta chutada, que o
   * navegador teria de desmentir depois.
   */
  const [cabemOsDois, setCabemOsDois] = useState<boolean | null>(null);

  useEffect(() => {
    const consulta = window.matchMedia("(min-width: 1024px)");
    const aplicar = () => setCabemOsDois(consulta.matches);
    aplicar();
    // girar o aparelho muda a resposta
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  const negar = useCallback((quem: Nome) => {
    setNegados((atual) => {
      const lista = atual ?? [];
      if (lista.includes(quem)) return lista;
      const nova = [...lista, quem];
      gravarNegados(nova);
      return nova;
    });
  }, []);

  /** Escolhe quem entra: o da vez, se ainda não foi recusado; senão, o outro. */
  const escolher = useCallback((recusados: Nome[], preferido?: Nome): Nome | null => {
    const ordem: Nome[] = preferido
      ? [preferido, preferido === "esteto" ? "termo" : "esteto"]
      : [proximaVez(), "esteto", "termo"];
    return ordem.find((n) => !recusados.includes(n)) ?? null;
  }, []);

  // ---- a cada página, recomeça
  useEffect(() => {
    const recusados = lerNegados();
    setNegados(recusados);
    setEmCena(escolher(recusados));
  }, [caminho, escolher]);

  /**
   * Quando o que estava em cena sai, o outro entra — se ainda não recusado.
   *
   * `sair` é chamado tanto no fim da conversa quanto na recusa. Nos dois casos
   * a vez passa adiante; o que muda é que na recusa a lista de recusados já
   * cresceu, então o que saiu não pode ser reescolhido.
   */
  const aoSair = useCallback(
    (quem: Nome) => {
      setEmCena((atual) => {
        if (atual !== quem) return atual;
        const outro: Nome = quem === "esteto" ? "termo" : "esteto";
        // lê do armazenamento, e não do estado: a recusa pode ter sido
        // gravada no mesmo instante, e o estado ainda não teria chegado aqui
        return lerNegados().includes(outro) ? null : outro;
      });
    },
    []
  );

  if (negados === null || cabemOsDois === null) return null;

  /*
    Ancorado no canto esquerdo porque o direito já tem WhatsApp, assistente e
    o atalho do cadastro — mais um ali viraria uma parede de botões.

    `items-start` para os dois balões alinharem pela esquerda em vez de
    esticarem: cada um tem a largura do próprio texto.
  */
  const canto = "fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-3 sm:bottom-6 sm:left-6";

  // ---------------------------------------------- computador: os dois juntos
  if (cabemOsDois) {
    const mostrar = (["esteto", "termo"] as Nome[]).filter((n) => !negados.includes(n));
    if (mostrar.length === 0) return null;

    return (
      <div data-flutuante="" className={canto}>
        {mostrar.map((nome, i) => {
          const eEsteto = nome === "esteto";
          return (
            <Mascote
              key={nome}
              personagem={eEsteto ? ESTETO : TERMO}
              Desenho={eEsteto ? Estetoscopio : Termometro}
              /*
                Escalonado: o segundo entra sete segundos depois do primeiro.

                Os dois ficam na tela juntos, que é o pedido, mas não digitam
                ao mesmo tempo — duas frases sendo escritas em paralelo não se
                leem, e as duas animações disputariam a mesma thread.

                Quando só um sobrou (o outro foi recusado), ele entra no tempo
                normal em vez de esperar a vez de alguém que não vem.
              */
              esperaSegundos={i === 0 ? 4 : 11}
              aoNegar={() => negar(nome)}
            />
          );
        })}
      </div>
    );
  }

  // ------------------------------------------------- celular: um de cada vez
  if (emCena === null) return null;

  /*
    `key` fica fora deste objeto de propósito: no React 19, espalhar um objeto
    que contém `key` é erro — ele precisa ser escrito direto no elemento.
  */
  const comum = {
    aoSair: () => aoSair(emCena),
    aoNegar: () => negar(emCena),
  };

  return (
    /*
      `key` no mascote força a remontagem quando um dá lugar ao outro: sem ela
      o React reaproveitaria o componente, e o novo personagem herdaria o
      estado de conversa do anterior — entrando já no meio de uma frase.
    */
    <div data-flutuante="" className={canto}>
      {emCena === "esteto" ? (
        <Mascote key="esteto" personagem={ESTETO} Desenho={Estetoscopio} {...comum} />
      ) : (
        /*
          Dois segundos para o segundo entrar, em vez dos quatro do primeiro.
          Quem já viu um balão nesta página não precisa do mesmo tempo de
          apresentação — mas entrar no instante seguinte ao "não" pareceria
          insistência.
        */
        <Mascote key="termo" personagem={TERMO} Desenho={Termometro} esperaSegundos={2} {...comum} />
      )}
    </div>
  );
}
