export const GLYPHS = '#%@*+=-:.';

export function scramble(text: string, progress: number, rand: () => number = Math.random): string {
  const p = Math.min(1, Math.max(0, progress));
  const shown = Math.round(p * text.length);
  let out = text.slice(0, shown);
  for (const ch of text.slice(shown)) {
    out += /\s/.test(ch) ? ch : GLYPHS[Math.floor(rand() * GLYPHS.length)];
  }
  return out;
}
