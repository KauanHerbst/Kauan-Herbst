import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, effect, inject, input } from '@angular/core';
import { accessibleText, childSpan } from './accessible-text';
import { prefersReducedMotion } from './scroll-ticker';

export function typedLength(
  elapsed: number,
  delay: number,
  msPerChar: number,
  length: number,
): number {
  if (elapsed <= delay) return 0;
  return Math.min(length, Math.floor((elapsed - delay) / msPerChar));
}

@Directive({ selector: '[appTyping]', host: { class: 'typing' } })
export class TypingText {
  readonly text = input.required<string>({ alias: 'appTyping' });
  readonly delay = input(300, { alias: 'appTypingDelay' });
  readonly speed = input(60, { alias: 'appTypingSpeed' });

  readonly keepCaret = input(false, { alias: 'appTypingKeepCaret' });

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const { real, visual } = accessibleText(host);
    const typed = childSpan(visual, 'typed');
    const caret = childSpan(visual, 'caret', (span) => (span.className = 'typing-caret'));
    const ghost = childSpan(host, 'ghost', (span) => {
      span.className = 'invisible';
      span.setAttribute('aria-hidden', 'true');
    });

    const animate = isPlatformBrowser(inject(PLATFORM_ID)) && !prefersReducedMotion();

    effect((onCleanup) => {
      const text = this.text();
      real.textContent = text;
      ghost.textContent = text;
      if (!animate) {
        typed.textContent = text;
        caret.hidden = true;
        return;
      }
      const delay = this.delay();
      const speed = this.speed();
      const keep = this.keepCaret();
      const start = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        const elapsed = now - start;
        const n = typedLength(elapsed, delay, speed, text.length);

        typed.textContent = n ? text.slice(0, n) : '\u200b';
        const done = n === text.length;
        caret.hidden = elapsed < delay || (done && !keep);
        if (!done) frame = requestAnimationFrame(tick);
      };
      tick(start);
      onCleanup(() => cancelAnimationFrame(frame));
    });
  }
}
