import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, PLATFORM_ID, Signal, effect, inject, signal, untracked } from '@angular/core';
import { prefersReducedMotion } from './scroll-ticker';

export function timedReveal(revealed: Signal<boolean>, duration: number): Signal<number> {
  const browser = isPlatformBrowser(inject(PLATFORM_ID));
  const t = signal(!browser || prefersReducedMotion() ? 1 : 0);
  let frame = 0;
  if (browser) inject(DestroyRef).onDestroy(() => cancelAnimationFrame(frame));

  const watcher = effect(() => {
    if (!revealed()) return;
    watcher.destroy();
    untracked(() => {
      if (t() === 1) return;
      let start: number | undefined;
      const step = (ts: number) => {
        start ??= ts;
        t.set(Math.min(1, (ts - start) / duration));
        if (t() < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
  });

  return t.asReadonly();
}
