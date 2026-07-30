/** Divisor com linha de ECG animada — assinatura médico-tech entre seções. */
export function EcgDivider() {
  return (
    <div className="mx-auto my-8 max-w-7xl px-5 sm:px-8" aria-hidden="true">
      <svg viewBox="0 0 1200 40" className="h-8 w-full" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="20" x2="1200" y2="20" stroke="var(--line)" strokeWidth="1.2" className="ecg-line" />
        <path
          d="M0 20 H480 l14 -13 l12 26 l16 -34 l14 41 l12 -20 H1200"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-pulse"
        />
      </svg>
    </div>
  );
}
