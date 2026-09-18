/* eslint-disable @next/next/no-html-link-for-pages */
type BrandProps = {
  className?: string;
  compact?: boolean;
};

export function Brand({ className = "", compact = false }: BrandProps) {
  return (
    <a className={`inspectre-brand ${className}`} href="/" aria-label="Inspectre Technologies — design directions">
      <span className="inspectre-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <b>I</b>
      </span>
      {!compact && <span className="inspectre-wordmark">Inspectre</span>}
    </a>
  );
}

export function DirectionLinks({ current }: { current: "signal" | "index" | "human" }) {
  return (
    <nav className="direction-links" aria-label="Switch design direction">
      <a aria-current={current === "signal" ? "page" : undefined} href="/signal">01</a>
      <a aria-current={current === "index" ? "page" : undefined} href="/index">02</a>
      <a aria-current={current === "human" ? "page" : undefined} href="/human">03</a>
    </nav>
  );
}
