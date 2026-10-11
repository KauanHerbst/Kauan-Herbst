import { Directive, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { ScrollTicker, prefersReducedMotion } from './scroll-ticker';

const REVEAL_LINE = 0.9;

@Directive({
  selector: '[appReveal]',
  host: { '[class.revealed]': 'revealed()' },
})
export class Reveal {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly ticker = inject(ScrollTicker);
  private readonly laidOut = signal(false);
  private seen = prefersReducedMotion();

  readonly revealed = computed(() => {
    if (this.seen) return true;
    this.ticker.y();
    if (!this.laidOut()) return false;
    this.seen = this.el.getBoundingClientRect().top < this.ticker.vh() * REVEAL_LINE;
    return this.seen;
  });

  constructor() {
    afterNextRender(() => this.laidOut.set(true));
  }
}
