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

export function EntrarComGoogle({ aoIdentificar, escuro }: Props) {
  const [fase, setFase] = useState<"convite" | "carregando" | "pronto" | "erro">("convite");
  const caixa = useRef<HTMLDivElement>(null);
  // guardado em ref, e não em state: o callback do Google é registrado uma vez
  // e não deve ser recriado a cada render do formulário
  const avisar = useRef(aoIdentificar);
  avisar.current = aoIdentificar;

  const desenhar = useCallback(() => {
    const g = window.google;
    if (!g || !caixa.current) return setFase("erro");

    g.accounts.id.initialize({
      client_id: site.googleClientId,
      // sem seleção automática: a pessoa escolhe a conta toda vez
      auto_select: false,
      callback: ({ credential }) => {
        if (!credential) return;
        const carga = lerCarga(credential);
        if (!carga?.email) return setFase("erro");
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
  }, [escuro]);

  const carregar = useCallback(() => {
    setFase("carregando");
    if (window.google) return desenhar();

    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = desenhar;
    script.onerror = () => setFase("erro");
    document.head.appendChild(script);
  }, [desenhar]);

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
      <p className="rounded-2xl border hairline p-4 text-[0.84rem] leading-relaxed text-faint">
        Não foi possível carregar o botão do Google agora. Sem problema — é só
        preencher os campos abaixo normalmente.
      </p>
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
