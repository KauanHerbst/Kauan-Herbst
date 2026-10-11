import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrambleText } from '../motion/scramble-text';

@Component({
  selector: 'app-section-stamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrambleText],
  host: { class: 'block mb-12 md:mb-16' },
  template: `
    <h2
      [id]="headingId()"
      [appScramble]="label()"
      class="font-mono uppercase tracking-[0.2em] leading-[0.9] text-[33px] sm:text-[44px] lg:text-[77px] break-words"
    ></h2>
  `,
})
export class SectionStamp {
  readonly label = input.required<string>();
  readonly headingId = input.required<string>();
}
