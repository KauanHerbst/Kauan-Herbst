import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PixelReveal } from '../art/pixel-reveal';
import { Reveal } from '../motion/reveal';
import { copy } from '../i18n/i18n';
import { PageSection } from '../layout/page-section';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PixelReveal, Reveal, PageSection],
  template: `
    <app-page-section sectionId="sobre">
      <div class="grid gap-12 md:grid-cols-[auto_1fr] md:items-start">
        <app-pixel-reveal src="art/workstation.png" [alt]="t().artAlt" [scale]="4" [seed]="7" />
        <p appReveal class="reveal-right max-w-2xl text-xl md:text-2xl font-light leading-relaxed">
          {{ p().bio }}
        </p>
      </div>
    </app-page-section>
  `,
})
export class About {
  protected readonly t = copy('about');
  protected readonly p = copy('profile');
}
