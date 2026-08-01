"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Aviso de conteúdo novo — notificação do navegador.
 *
 * Regra número um: **o pedido de permissão só aparece depois de um clique.**
 * Nunca ao abrir a página. Além de ser invasivo, o Chrome pune site que pergunta
 * de cara — se muita gente recusa, ele passa a esconder o pedido de todo mundo.
 * Por isso este bloco explica primeiro o que a pessoa vai receber, e só chama o
 * navegador quando ela decide.
 *
 * Regra número dois: se não houver chave pública configurada, nada disso
 * aparece. O site não mostra um botão que não funciona.
 */

const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

type Estado =
  | "verificando"
  | "indisponivel"
  | "precisaInstalar"
  | "desligado"
  | "processando"
  | "ligado"
  | "negado"
  | "erro";

/**
 * A chave VAPID viaja em base64url e o navegador exige bytes crus.
 *
 * O `ArrayBuffer` é alocado primeiro e a visão vem depois de propósito: assim o
 * tipo devolvido é o que a API de inscrição aceita, sem conversão no meio.
 */
function chaveEmBytes(base64url: string): ArrayBuffer {
  const preenchido = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const bin = atob(preenchido);
  const buffer = new ArrayBuffer(bin.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return buffer;
}

/**
 * No iPhone, notificação da web só funciona se o site tiver sido adicionado à
 * Tela de Início. É restrição da Apple, não do site — sem isso o `PushManager`
 * nem existe no Safari.
 */
const noIphone = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const instalado = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

export function Notificacoes({ compacto = false }: { compacto?: boolean }) {
  const [estado, setEstado] = useState<Estado>("verificando");

  useEffect(() => {
    if (!CHAVE_PUBLICA) return setEstado("indisponivel");

    const suportado =
      "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

    if (!suportado) {
      return setEstado(noIphone() && !instalado() ? "precisaInstalar" : "indisponivel");
    }
    if (Notification.permission === "denied") return setEstado("negado");

    // já inscrito neste aparelho?
    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then((reg) => reg?.pushManager.getSubscription())
      .then((inscricao) => setEstado(inscricao ? "ligado" : "desligado"))
      .catch(() => setEstado("desligado"));
  }, []);

  const inscrever = useCallback(async () => {
    setEstado("processando");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") return setEstado(permissao === "denied" ? "negado" : "desligado");

      const inscricao = await reg.pushManager.subscribe({
        // obrigatório: garante que todo push recebido vira um aviso visível.
        // Sem isso o navegador recusa a inscrição — e é uma boa regra: impede
        // que um site use push para rodar código em segundo plano sem a pessoa
        // perceber.
        userVisibleOnly: true,
        applicationServerKey: chaveEmBytes(CHAVE_PUBLICA),
      });

      const resposta = await fetch("/api/notificacoes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(inscricao.toJSON()),
      });
      if (!resposta.ok) throw new Error("servidor recusou");

      setEstado("ligado");
    } catch {
      setEstado("erro");
    }
  }, []);

  const cancelar = useCallback(async () => {
    setEstado("processando");
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const inscricao = await reg?.pushManager.getSubscription();
      if (inscricao) {
        await fetch("/api/notificacoes", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: inscricao.endpoint }),
        });
        await inscricao.unsubscribe();
      }
      setEstado("desligado");
    } catch {
      setEstado("erro");
    }
  }, []);

  if (estado === "verificando" || estado === "indisponivel") return null;

  const textos: Record<string, { titulo: string; corpo: string }> = {
    precisaInstalar: {
      titulo: "Receber avisos no iPhone",
      corpo:
        "No iPhone, o aviso só funciona com o site adicionado à Tela de Início — é uma exigência da Apple. Toque no botão de compartilhar do Safari e escolha “Adicionar à Tela de Início”. Depois é só voltar aqui.",
    },
    negado: {
      titulo: "Avisos bloqueados neste navegador",
      corpo:
        "Você recusou os avisos antes, e só o navegador pode reverter isso. Abra as configurações do site (o cadeado ao lado do endereço) e libere as notificações.",
    },
    ligado: {
      titulo: "Você será avisado",
      corpo:
        "Quando sair um artigo novo ou um comunicado do consultório, o aviso chega neste aparelho. Nada de propaganda e nada sobre o seu atendimento.",
    },
    erro: {
      titulo: "Não foi possível ativar",
      corpo: "Algo falhou no caminho. Tente de novo daqui a pouco.",
    },
  };

  const conteudo = textos[estado] ?? {
    titulo: "Quer ser avisado de conteúdo novo?",
    corpo:
      "Receba um aviso quando sair um artigo novo ou um comunicado do consultório. Só isso — sem propaganda, sem mensagem sobre o seu atendimento, e você cancela quando quiser.",
  };

  const acao =
    estado === "desligado" || estado === "erro" ? (
      <button type="button" onClick={inscrever} className="btn-primary mt-5">
        Quero ser avisado
        <span aria-hidden="true">→</span>
      </button>
    ) : estado === "ligado" ? (
      <button
        type="button"
        onClick={cancelar}
        className="mt-4 text-[0.86rem] font-medium text-muted underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
      >
        Não quero mais receber
      </button>
    ) : estado === "processando" ? (
      <p className="font-mono-tech mt-5 text-[0.78rem] uppercase tracking-[0.14em] text-faint">
        Aguarde…
      </p>
    ) : null;

  return (
    <div className={`holo glass rounded-3xl ${compacto ? "p-6" : "p-7 sm:p-9"}`}>
      <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent)]">
        {estado === "ligado" ? "Avisos ativos" : "Avisos"}
      </p>
      <h2
        className={`mt-3 font-display font-semibold tracking-tight ${
          compacto ? "text-xl" : "text-2xl sm:text-[1.7rem]"
        }`}
      >
        {conteudo.titulo}
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">{conteudo.corpo}</p>
      {acao}
      {(estado === "desligado" || estado === "erro") && (
        <p className="mt-4 text-[0.78rem] leading-relaxed text-faint">
          O site guarda apenas o endereço de entrega do aparelho, sem nome, telefone ou e-mail.
          Detalhes na{" "}
          <a href="/politica-de-privacidade" className="underline underline-offset-2">
            política de privacidade
          </a>
          .
        </p>
      )}
    </div>
  );
}
