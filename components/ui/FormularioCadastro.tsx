"use client";

import { useState } from "react";

/**
 * Formulário do cadastro de pacientes.
 *
 * A validação existe nos dois lados de propósito. Aqui ela é conveniência —
 * apontar o erro antes de o visitante enviar. A que vale é a do servidor
 * (`lib/cadastro.ts`), porque qualquer coisa checada só no navegador pode ser
 * contornada por quem quiser.
 */

type Campo = {
  nome: keyof typeof VAZIO;
  rotulo: string;
  tipo?: string;
  dica?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
};

const VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  nascimento: "",
  cidade: "",
  origem: "",
  observacao: "",
};

const CAMPOS: Campo[] = [
  { nome: "nome", rotulo: "Nome completo", autoComplete: "name" },
  { nome: "email", rotulo: "E-mail", tipo: "email", autoComplete: "email", inputMode: "email" },
  {
    nome: "telefone",
    rotulo: "Telefone com DDD",
    tipo: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    dica: "WhatsApp, de preferência",
  },
  { nome: "cpf", rotulo: "CPF", inputMode: "numeric", dica: "Usado no seu cadastro clínico e nos recibos" },
  { nome: "nascimento", rotulo: "Data de nascimento", tipo: "date", autoComplete: "bday" },
  { nome: "cidade", rotulo: "Cidade onde mora", autoComplete: "address-level2" },
];

const ORIGENS = [
  "Indicação de outro paciente",
  "Indicação de outro médico",
  "Instagram",
  "Google",
  "Já sou paciente",
  "Outro",
];

/** Máscaras que só formatam o que a pessoa digita — não bloqueiam a digitação. */
function mascarar(campo: string, valor: string): string {
  const d = valor.replace(/\D/g, "");
  if (campo === "cpf") {
    return d
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  if (campo === "telefone") {
    const n = d.slice(0, 11);
    if (n.length <= 10) return n.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/[-\s()]*$/, "");
    return n.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  }
  return valor;
}

export function FormularioCadastro() {
  const [dados, setDados] = useState({ ...VAZIO });
  const [aceito, setAceito] = useState(false);
  // começa desmarcado de propósito: consentimento pré-marcado não é
  // consentimento — a pessoa tem de escolher receber
  const [querAvisos, setQuerAvisos] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"parado" | "enviando" | "pronto">("parado");
  const [falha, setFalha] = useState("");

  const mudar = (campo: string, valor: string) => {
    setDados((d) => ({ ...d, [campo]: mascarar(campo, valor) }));
    setErros((e) => (e[campo] ? { ...e, [campo]: "" } : e));
  };

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado("enviando");
    setFalha("");
    try {
      const resposta = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...dados, consentimento: aceito, avisosEmail: querAvisos }),
      });
      const corpo = await resposta.json().catch(() => ({}));

      if (resposta.ok) return setEstado("pronto");
      if (corpo.erros) {
        setErros(corpo.erros);
        setEstado("parado");
        // leva o foco para o primeiro campo com problema
        const primeiro = Object.keys(corpo.erros)[0];
        document.getElementById(`campo-${primeiro}`)?.focus();
        return;
      }
      setFalha(corpo.erro ?? "Não foi possível enviar agora.");
      setEstado("parado");
    } catch {
      setFalha("Sem conexão com o servidor. Tente de novo.");
      setEstado("parado");
    }
  }

  if (estado === "pronto") {
    return (
      <div className="holo glass rounded-3xl p-8 text-center sm:p-10">
        <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent)]">
          Cadastro recebido
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          Pronto, {dados.nome.split(" ")[0]}.
        </h2>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted">
          Seus dados chegaram e ficam guardados de forma criptografada. O consultório entra em
          contato pelo telefone que você informou.
        </p>
      </div>
    );
  }

  const classeCampo = (campo: string) =>
    `glass w-full rounded-2xl px-4 py-3.5 text-[0.95rem] outline-none ring-1 transition-all placeholder:text-faint focus:ring-2 ${
      erros[campo]
        ? "ring-red-500/70"
        : "ring-[color-mix(in_srgb,var(--fg)_14%,transparent)] focus:ring-[var(--accent)]"
    }`;

  return (
    <form onSubmit={enviar} noValidate className="holo glass rounded-3xl p-6 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        {CAMPOS.map((campo) => (
          <div key={campo.nome} className={campo.nome === "nome" ? "sm:col-span-2" : ""}>
            <label
              htmlFor={`campo-${campo.nome}`}
              className="font-mono-tech mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-faint"
            >
              {campo.rotulo}
            </label>
            <input
              id={`campo-${campo.nome}`}
              name={campo.nome}
              type={campo.tipo ?? "text"}
              inputMode={campo.inputMode}
              autoComplete={campo.autoComplete}
              value={dados[campo.nome]}
              onChange={(e) => mudar(campo.nome, e.target.value)}
              aria-invalid={!!erros[campo.nome]}
              aria-describedby={erros[campo.nome] ? `erro-${campo.nome}` : undefined}
              className={classeCampo(campo.nome)}
            />
            {erros[campo.nome] ? (
              <p id={`erro-${campo.nome}`} className="mt-1.5 text-[0.8rem] text-red-400">
                {erros[campo.nome]}
              </p>
            ) : campo.dica ? (
              <p className="mt-1.5 text-[0.78rem] text-faint">{campo.dica}</p>
            ) : null}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label
            htmlFor="campo-origem"
            className="font-mono-tech mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-faint"
          >
            Como você chegou até o consultório
          </label>
          <select
            id="campo-origem"
            name="origem"
            value={dados.origem}
            onChange={(e) => mudar("origem", e.target.value)}
            aria-invalid={!!erros.origem}
            className={classeCampo("origem")}
          >
            <option value="">Selecione</option>
            {ORIGENS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {erros.origem && <p className="mt-1.5 text-[0.8rem] text-red-400">{erros.origem}</p>}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="campo-observacao"
            className="font-mono-tech mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-faint"
          >
            Quer contar algo antes do contato? (opcional)
          </label>
          <textarea
            id="campo-observacao"
            name="observacao"
            rows={3}
            value={dados.observacao}
            onChange={(e) => mudar("observacao", e.target.value)}
            className={`${classeCampo("observacao")} resize-y`}
          />
          <p className="mt-1.5 text-[0.78rem] text-faint">
            Não descreva sintomas ou envie resultados de exames por aqui — isso é assunto da
            consulta.
          </p>
        </div>
      </div>

      <label className="mt-7 flex cursor-pointer items-start gap-3 text-[0.86rem] leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span>
          Autorizo o uso destes dados para que o consultório entre em contato comigo e mantenha
          meu cadastro, conforme a{" "}
          <a href="/politica-de-privacidade" className="underline underline-offset-2">
            política de privacidade
          </a>
          . Posso pedir a exclusão a qualquer momento.
        </span>
      </label>
      {erros.consentimento && (
        <p className="mt-2 text-[0.8rem] text-red-400">{erros.consentimento}</p>
      )}

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.86rem] leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={querAvisos}
          onChange={(e) => setQuerAvisos(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <span>
          Quero receber por e-mail um aviso quando sair artigo novo ou comunicado do
          consultório. Sem propaganda, e com link para sair da lista em todo e-mail.
        </span>
      </label>

      {falha && (
        <p role="alert" className="mt-5 rounded-2xl border hairline p-4 text-[0.86rem] text-red-400">
          {falha}
        </p>
      )}

      <button type="submit" disabled={estado === "enviando"} className="btn-primary mt-7 w-full justify-center sm:w-auto">
        {estado === "enviando" ? "Enviando…" : "Enviar cadastro"}
        {estado !== "enviando" && <span aria-hidden="true">→</span>}
      </button>

      <p className="mt-5 text-[0.78rem] leading-relaxed text-faint">
        Os dados são gravados criptografados e ficam acessíveis apenas ao Dr. José Victor. Não são
        vendidos, compartilhados nem usados para publicidade.
      </p>
    </form>
  );
}
