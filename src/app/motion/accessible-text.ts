export function childSpan(
  host: HTMLElement,
  role: string,
  setup: (span: HTMLSpanElement) => void = () => {},
): HTMLSpanElement {
  const existing = Array.from(host.children).find(
    (child) => child.getAttribute('data-role') === role,
  ) as HTMLSpanElement | undefined;
  if (existing) return existing;
  const span = host.ownerDocument.createElement('span');
  span.setAttribute('data-role', role);
  setup(span);
  host.appendChild(span);
  return span;
}

export function accessibleText(host: HTMLElement): {
  real: HTMLSpanElement;
  visual: HTMLSpanElement;
} {
  const real = childSpan(host, 'real', (span) => (span.className = 'sr-only'));
  const visual = childSpan(host, 'visual', (span) => span.setAttribute('aria-hidden', 'true'));
  return { real, visual };
}
