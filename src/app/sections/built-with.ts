import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExternalLink } from '../layout/external-link';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorArrowUpRight, phosphorGithubLogo } from '@ng-icons/phosphor-icons/regular';
import { HbButtonComponent } from '@shared/ui/button';
import { PurpleLeaves } from '../art/purple-leaves';
import { Reveal } from '../motion/reveal';
import { HERBST_UI } from '../core/content';
import { copy } from '../i18n/i18n';

@Component({
  selector: 'app-built-with',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExternalLink, HbButtonComponent, NgIcon, PurpleLeaves, Reveal],
  viewProviders: [provideIcons({ phosphorArrowUpRight, phosphorGithubLogo })],

  host: { class: 'relative overflow-hidden md:sticky md:top-14 md:h-[calc(100svh-3.5rem)]' },
  template: `
    <app-purple-leaves #leaves />
    <section id="feito-com" aria-labelledby="feito-com-title" class="container-page relative">
      <div appReveal class="reveal-left mx-auto max-w-2xl text-center">
        <p class="eyebrow text-muted-foreground">{{ t().eyebrow }}</p>
        <h2
          id="feito-com-title"
          class="mt-4 font-display italic text-[56px] md:text-[96px] leading-[0.9] tracking-[-0.03em]"
        >
          Herbst UI
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
          {{ t().text }}
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            hb-button
            hbSize="lg"
            class="gap-2"
            [href]="herbstUi.site"
            appExternal
            (mouseenter)="leaves.gust()"
            (focus)="leaves.gust()"
          >
            {{ t().cta }}
            <ng-icon name="phosphorArrowUpRight" aria-hidden="true" />
          </a>
          <a hb-button hbType="ghost" hbSize="lg" class="gap-2" [href]="herbstUi.repo" appExternal>
            <ng-icon name="phosphorGithubLogo" aria-hidden="true" />
            {{ t().code }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class BuiltWith {
  protected readonly t = copy('builtWith');
  protected readonly herbstUi = HERBST_UI;
}
