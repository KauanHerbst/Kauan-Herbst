import { Directive, ElementRef, afterNextRender, effect, inject, signal } from '@angular/core';
import { copy } from '../i18n/i18n';
import { childSpan } from '../motion/accessible-text';

@Directive({
  selector: 'a[appExternal]',
  host: { target: '_blank', rel: 'noopener noreferrer' },
})
export class ExternalLink {
  constructor() {
    const host: HTMLAnchorElement = inject(ElementRef).nativeElement;
    const a11y = copy('a11y');
    const notice = signal<HTMLSpanElement | null>(null);
    afterNextRender(() =>
      notice.set(childSpan(host, 'new-tab', (span) => (span.className = 'sr-only'))),
    );
    effect(() => {
      const span = notice();
      if (span) span.textContent = ` ${a11y().newTab}`;
    });
  }
}
