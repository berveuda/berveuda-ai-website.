export function SymbolMark() {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
      <path d="M4 3h17l9 6-5.2 5.5-7.3-5H10zM9.6 14h13.9l8.3 6.1L25 26l-6.2-5.1H5.5zM5.2 25.1h12.4l7.4 5.8-4.2 3H1z" />
    </svg>
  );
}
export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Berveuda AI home">
      <SymbolMark />
      <span>
        Berveuda <b>AI</b>
      </span>
    </a>
  );
}
