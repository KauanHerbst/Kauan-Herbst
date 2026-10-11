import { Directive, ElementRef, effect, inject, input } from '@angular/core';
import { accessibleText } from './accessible-text';
import { scramble } from './scramble';
import { Reveal } from './reveal';
import { timedReveal } from './timed-reveal';

const DURATION = 900;

@Directive({
  selector: '[appScramble]',
  hostDirectives: [Reveal],
})
export class ScrambleText {
  readonly text = input.required<string>({ alias: 'appScramble' });

  private readonly t = timedReveal(inject(Reveal).revealed, DURATION);

  constructor() {
    const { real, visual } = accessibleText(inject(ElementRef).nativeElement);

    effect(() => {
      real.textContent = this.text();
      visual.textContent = scramble(this.text(), this.t());
    });
  }
}
