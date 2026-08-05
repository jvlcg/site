"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site-config";

/**
 * Botão "Continuar com Google" do formulário de cadastro.
 *
 * O que ele faz: preenche nome e e-mail, e entrega ao formulário o token que
 * prova ao servidor que aquele e-mail é mesmo da pessoa. Não cria conta, não
 * abre sessão, não guarda nada no navegador.
 *
 * ## Três decisões que valem explicação
 *
 * **1. O script do Google só é baixado quando a pessoa pede.** Enquanto ela
 * não tocar em "Usar minha conta do Google", nada do Google é carregado —
 * nenhum script, nenhuma requisição, nenhum cookie. Numa página de cadastro de
 * consultório isso não é economia de bytes: é a diferença entre o Google saber
 * ou não saber que aquela pessoa esteve aqui. Quem preenche à mão nunca aparece
 * para eles.
 *
 * **2. Nada de One Tap.** O Google oferece um pop-up que aparece sozinho ao
 * abrir a página, com a conta já sugerida. Converte mais e está fora de questão
 * aqui: seria enviar o dado antes de perguntar, e o dado é que esta pessoa
 * procurou um médico.
 *
 * **3. O que o botão preenche não é o que o servidor acredita.** O nome e o
 * e-mail que aparecem no formulário saem da leitura direta do token, sem
 * conferir assinatura — é só para mostrar na tela, e a pessoa pode corrigir os
 * dois campos à mão depois. Quem confere de verdade é o servidor, no envio
 * (`lib/google-identidade.ts`), e é só de lá que sai a marca de "e-mail
 * verificado". Ler sem verificar aqui não abre brecha nenhuma: o pior que
 * alguém consegue forjando um token no próprio navegador é preencher o próprio
 * formulário com o texto que já poderia ter digitado.
 */

type Credencial = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resposta: Credencial) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
          }) => void;
          renderButton: (
            elemento: HTMLElement,
            opcoes: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "small" | "medium" | "large";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill";
              locale?: string;
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

const SCRIPT = "https://accounts.google.com/gsi/client";

type Props = {
  /** Recebe o que veio do Google e o token cru, para viajar junto do cadastro. */
  aoIdentificar: (dados: { nome: string; email: string; credencial: string }) => void;
  /** Escuro ou claro — o botão do Google não herda o tema do site sozinho. */
  escuro: boolean;
  /**
   * O que dizer quando o botão não carrega, e **por que isto é uma prop**.
   *
   * O texto padrão manda preencher os campos abaixo, que é a saída certa no
   * cadastro de paciente — lá o Google só adianta o preenchimento. Na tela de
   * entrar não há campo nenhum abaixo: o Google é o único caminho, e mandar a
   * pessoa preencher o que não existe é pior que não dizer nada.
   */
  alternativa?: React.ReactNode;
};

/**
 * Lê a carga do token sem verificar. Só para preencher a tela — ver o cabeçalho.
 *
 * O caminho é mais longo que um `atob` porque `atob` devolve bytes como se
 * fossem caracteres: "José" volta como "JosÃ©". O `TextDecoder` é o que
 * interpreta os bytes como UTF-8, e nome de gente tem acento.
 */
function lerCarga(token: string): { name?: string; email?: string } | null {
  try {
    const [, carga] = token.split(".");
    if (!carga) return null;
    const base64 = carga.replace(/-/g, "+").replace(/_/g, "/");
    const bruto = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
    const bytes = Uint8Array.from(bruto, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export function EntrarComGoogle({ aoIdentificar, escuro, alternativa }: Props) {
  const [fase, setFase] = useState<"convite" | "carregando" | "pronto" | "erro">("convite");
  /**
   * Script do Google disponível — separado de `fase` de propósito.
   *
   * O desenho do botão depende de **duas** coisas que ficam prontas em ordens
   * diferentes: o script do Google e o `<div>` que recebe o botão. O `<div>` só
   * entra na árvore quando `fase` sai de "convite", e `setFase` não é imediato.
   *
   * Guardar as duas condições em estado e desenhar num efeito é o que garante
   * que o desenho aconteça quando as duas valerem, em qualquer ordem. Ver o
   * comentário do `carregar` para o defeito que isso corrige.
   */
  const [scriptPronto, setScriptPronto] = useState(false);
  /**
   * Por que falhou, em uma linha curta mostrada na tela.
   *
   * Existe porque as três causas possíveis são indistinguíveis para quem
   * está olhando — e também eram para mim, a distância. "Não carregou" manda
   * a pessoa (e quem for ajudar) adivinhar entre bloqueador, configuração do
   * Google e rede lenta, que pedem coisas diferentes.
   *
   * Vai também para o console, para quem souber abrir.
   */
  const [motivo, setMotivo] = useState("");
  const falhar = useCallback((porque: string) => {
    setMotivo(porque);
    console.error("[EntrarComGoogle]", porque);
    setFase("erro");
  }, []);
  const caixa = useRef<HTMLDivElement>(null);
  // guardado em ref, e não em state: o callback do Google é registrado uma vez
  // e não deve ser recriado a cada render do formulário
  const avisar = useRef(aoIdentificar);
  avisar.current = aoIdentificar;

  const desenhar = useCallback(() => {
    const g = window.google;
    if (!g) return falhar("o arquivo do Google carregou mas não se instalou");
    if (!caixa.current) return falhar("a área do botão não estava pronta");

    /*
      `try` porque o Google avisa de configuração errada **lançando**: origem
      fora da lista de autorizadas, cliente apagado, id trocado. Sem isto a
      exceção sobe do efeito, `fase` fica presa em "carregando" e a tela mostra
      "Carregando…" para sempre — pior que o aviso de erro, porque parece
      internet lenta e a pessoa fica esperando.
    */
    try {
      g.accounts.id.initialize({
        client_id: site.googleClientId,
        // sem seleção automática: a pessoa escolhe a conta toda vez
        auto_select: false,
        callback: ({ credential }) => {
          if (!credential) return;
          const carga = lerCarga(credential);
          if (!carga?.email) return falhar("o Google respondeu sem e-mail");
          avisar.current({
            nome: carga.name ?? "",
            email: carga.email,
            credencial: credential,
          });
        },
      });

      g.accounts.id.renderButton(caixa.current, {
        type: "standard",
        theme: escuro ? "filled_black" : "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        locale: "pt-BR",
      });
      setFase("pronto");
    } catch (e) {
      // a mensagem do Google diz qual é o problema de configuração
      falhar(`o Google recusou: ${String((e as Error)?.message ?? e).slice(0, 120)}`);
    }
  }, [escuro, falhar]);

  /**
   * Baixa o script do Google. **Não desenha nada** — quem desenha é o efeito
   * abaixo.
   *
   * O defeito que isso corrige: antes, `carregar` chamava `desenhar()` na hora
   * quando `window.google` já existia. Só que `setFase("carregando")` não muda
   * a tela na mesma linha — o React re-renderiza depois. Então `desenhar()`
   * rodava enquanto a fase ainda era "convite", e nessa fase o `<div>` que
   * recebe o botão **não está na tela**: `caixa.current` valia `null` e o
   * componente caía direto na mensagem de erro.
   *
   * Aparecia sempre que o script já estivesse carregado — ou seja, para quem
   * usou o botão numa página e navegou para outra pelo próprio site, que é o
   * caminho normal entre o cadastro, a conta e uma aula. Na primeira visita
   * funcionava, o que fazia o defeito parecer instabilidade do Google.
   */
  const carregar = useCallback(() => {
    setFase("carregando");
    if (window.google) return setScriptPronto(true);

    /*
      Reaproveita a tag que já estiver na página. Dois destes componentes na
      mesma tela — o do cadastro e o de uma aula — pediriam o mesmo arquivo
      duas vezes, e a segunda cópia reinicializaria o cliente do Google por
      baixo da primeira.
    */
    /*
      Uma tag que já falhou é **descartada**, não reaproveitada.

      `load` e `error` disparam uma vez só. Pendurar um ouvinte novo numa tag
      morta é esperar por um evento que nunca mais vem: a falha virava
      permanente até a pessoa recarregar a página inteira — e navegar pelo
      site não recarrega, porque `document.head` sobrevive à troca de rota.
      Quem tentasse de novo depois de um tropeço de rede ficava preso no erro.
    */
    const existente = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if (existente?.dataset.falhou) existente.remove();

    const reusar = existente && !existente.dataset.falhou ? existente : null;
    const script = reusar ?? document.createElement("script");
    script.addEventListener("load", () => setScriptPronto(true), { once: true });
    script.addEventListener(
      "error",
      () => {
        script.dataset.falhou = "1";
        falhar("o navegador não conseguiu baixar accounts.google.com/gsi/client");
      },
      { once: true }
    );
    if (!reusar) {
      script.src = SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [falhar]);

  /**
   * Desenha quando as duas condições valerem, em qualquer ordem: script
   * disponível e `<div>` já na tela. É o efeito que roda depois do render, e é
   * justamente por isso que aqui o `caixa.current` existe.
   */
  useEffect(() => {
    if (fase !== "carregando" || !scriptPronto || !caixa.current) return;
    desenhar();
  }, [fase, scriptPronto, desenhar]);

  /**
   * Desiste depois de 10 segundos.
   *
   * `onerror` cobre o pedido que falha, e não cobre o pedido que **fica
   * pendurado** — que é justamente o que bloqueador de anúncio e extensão de
   * privacidade costumam fazer com `accounts.google.com`. Sem prazo, a tela
   * fica em "Carregando…" indefinidamente e a pessoa não descobre que precisa
   * fazer alguma coisa.
   *
   * Dez segundos é folgado para 4G ruim e curto o bastante para não parecer
   * travamento.
   */
  useEffect(() => {
    if (fase !== "carregando") return;
    const prazo = setTimeout(
      () => falhar("o pedido ao Google ficou 10 s sem resposta e sem erro"),
      10_000
    );
    return () => clearTimeout(prazo);
  }, [fase, falhar]);

  // Se o tema mudar depois de o botão já estar na tela, redesenha — o botão do
  // Google é pintado uma vez e não acompanha a troca sozinho.
  useEffect(() => {
    if (fase === "pronto" && caixa.current) {
      caixa.current.innerHTML = "";
      desenhar();
    }
    // `fase` de fora de propósito: só o tema deve disparar o redesenho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escuro]);

  if (!site.googleClientId) return null;

  if (fase === "erro") {
    return (
      <div className="rounded-2xl border hairline p-4 text-[0.84rem] leading-relaxed text-faint">
        <p>
          {alternativa ?? (
            <>
              Não foi possível carregar o botão do Google agora. Sem problema —
              é só preencher os campos abaixo normalmente.
            </>
          )}
        </p>
        {/*
          O motivo técnico fica visível, em letra pequena.

          Poluir a tela com jargão não é bonito, e a alternativa é pior: sem
          isto, "não carregou" é tudo o que a pessoa consegue relatar, e as
          três causas possíveis — bloqueador, configuração do Google, rede
          pendurada — pedem soluções diferentes. Uma linha aqui é a diferença
          entre um relato que resolve e um que só repete o sintoma.
        */}
        {motivo && (
          <p className="font-mono-tech mt-3 border-t hairline pt-2.5 text-[0.68rem] leading-relaxed opacity-70">
            Detalhe técnico: {motivo}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border hairline p-5">
      {fase === "convite" ? (
        <>
          <p className="font-display text-[0.95rem] font-semibold">
            Preencher com a sua conta do Google
          </p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
            Seu nome e e-mail chegam prontos e confirmados, e você digita só o
            resto. Nenhuma conta é criada aqui, e o consultório não recebe
            acesso nenhum ao seu Google.
          </p>
          {/*
            O aviso vem antes do botão, e não em letra miúda depois, porque a
            informação que sai daqui não é banal: é o Google ficar sabendo que
            esta pessoa se cadastrou com um médico. Pela LGPD isso é dado
            sensível, e consentimento sensível tem de ser informado e específico
            — não pode estar embutido num botão que a pessoa aperta por hábito.
          */}
          <p className="mt-3 rounded-xl border hairline p-3 text-[0.8rem] leading-relaxed text-faint">
            <strong className="text-[var(--fg)]">Antes de tocar:</strong> ao usar
            o Google, ele fica sabendo que você se cadastrou neste site — que é
            de um consultório médico. Se preferir que isso não aconteça,{" "}
            <strong className="text-[var(--fg)]">
              preencha os campos abaixo à mão
            </strong>
            : o cadastro é exatamente o mesmo, e nada é enviado ao Google.
          </p>
          <button
            type="button"
            onClick={carregar}
            className="btn-ghost mt-4 !py-2.5 text-sm"
          >
            Usar minha conta do Google
          </button>
        </>
      ) : (
        <>
          <p className="font-display text-[0.95rem] font-semibold">
            Escolha a conta
          </p>
          <div ref={caixa} className="mt-3 min-h-[44px]" />
          {fase === "carregando" && (
            <p className="text-[0.82rem] text-faint">Carregando…</p>
          )}
        </>
      )}
    </div>
  );
}
