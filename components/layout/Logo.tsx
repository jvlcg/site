import { site } from "@/lib/site-config";

/**
 * Logomarca "Sinapse JV": monograma em traço fino sobre malha de nós —
 * referência abstrata ao sistema endocanabinoide como rede reguladora.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="jv-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      {/* malha de fundo */}
      <g stroke="currentColor" strokeOpacity="0.28" strokeWidth="1">
        <path d="M24 16 38 16" />
        <path d="M24 40 44 46" />
        <path d="M12 16 24 40" />
        <path d="M52 16 38 16" />
      </g>
      {/* J */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 16 H24" />
        <path d="M24 16 V38 Q24 46 15.5 46" />
      </g>
      {/* V */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M38 16 44 46 52 16" />
      </g>
      {/* nós da rede */}
      <g fill="currentColor">
        <circle cx="12" cy="16" r="2.2" />
        <circle cx="24" cy="16" r="2.2" />
        <circle cx="38" cy="16" r="2.2" />
        <circle cx="52" cy="16" r="2.2" />
        <circle cx="15.5" cy="46" r="2.2" />
      </g>
      {/* nó-sinapse em destaque */}
      <circle cx="44" cy="46" r="4.4" fill="url(#jv-grad)" />
      <circle cx="44" cy="46" r="7.5" fill="none" stroke="url(#jv-grad)" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="h-9 w-9 shrink-0 text-[var(--fg)]" />
      <span className={`flex-col leading-tight ${compact ? "hidden sm:flex" : "flex"}`}>
        <span className="font-display text-[0.94rem] font-semibold tracking-tight">
          Dr. José Victor
        </span>
        <span className="text-[0.66rem] uppercase tracking-[0.16em] text-faint">
          Lisboa Cardoso Gomes · {site.crm}
        </span>
      </span>
    </span>
  );
}
