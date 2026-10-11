import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlagCode } from '../i18n/i18n';

const STRIPE_HEIGHT = 14 / 13;
const US_RED_STRIPES = [0, 2, 4, 6, 8, 10, 12].map((i) => i * STRIPE_HEIGHT);

@Component({
  selector: 'app-flag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', '[attr.data-flag]': 'code()' },
  template: `
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" class="rounded-[2px]">
      @switch (code()) {
        @case ('br') {
          <rect width="20" height="14" fill="#009C3B" />
          <polygon points="10,1.6 18.4,7 10,12.4 1.6,7" fill="#FFDF00" />
          <circle cx="10" cy="7" r="3.4" fill="#002776" />
          <path d="M6.7 6.3 Q10 5.4 13.3 7.4" stroke="#fff" stroke-width="0.6" fill="none" />
        }
        @case ('us') {
          <rect width="20" height="14" fill="#fff" />
          @for (y of stripes; track y) {
            <rect [attr.y]="y" width="20" [attr.height]="stripeHeight" fill="#B22234" />
          }
          <rect width="8.6" [attr.height]="stripeHeight * 7" fill="#3C3B6E" />
        }
      }
    </svg>
  `,
})
export class Flag {
  readonly code = input.required<FlagCode>();
  protected readonly stripes = US_RED_STRIPES;
  protected readonly stripeHeight = STRIPE_HEIGHT;
}
