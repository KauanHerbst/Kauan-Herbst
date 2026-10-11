import { Injectable, signal } from '@angular/core';

export const prefersReducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

@Injectable({ providedIn: 'root' })
export class ScrollTicker {
  readonly y = signal(0);
  readonly vh = signal(0);

  constructor() {
    if (typeof window === 'undefined') return;
    let queued = false;
    const read = () => {
      queued = false;
      this.y.set(window.scrollY);
      this.vh.set(window.innerHeight);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    if (typeof ResizeObserver === 'function')
      new ResizeObserver(schedule).observe(document.documentElement);
  }
}
