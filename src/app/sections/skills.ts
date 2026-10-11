import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCaretDown } from '@ng-icons/phosphor-icons/regular';
import { HbCarouselImports } from '@shared/ui/carousel';
import { HbHoverCardImports } from '@shared/ui/hover-card';
import { TECH_GROUPS, TECH_LOGOS } from '../core/content';
import { copy } from '../i18n/i18n';
import { PageSection } from '../layout/page-section';
import { Reveal } from '../motion/reveal';
import { prefersReducedMotion } from '../motion/scroll-ticker';

const LOGOS = TECH_GROUPS.flatMap((group) => group.items)
  .filter((item) => TECH_LOGOS[item])
  .map((name) => ({ name, src: TECH_LOGOS[name] }));

const GROUPS = TECH_GROUPS.map((group) => ({
  id: group.id,
  items: group.items.map((name) => ({ name, src: TECH_LOGOS[name] ?? null })),
}));

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageSection, Reveal, HbCarouselImports, HbHoverCardImports, NgIcon],
  viewProviders: [provideIcons({ phosphorCaretDown })],
  template: `
    <app-page-section sectionId="skills">
      <hb-carousel
        appReveal
        class="reveal-left block"
        [hbAriaLabel]="t().carousel"
        hbLoop
        [hbAutoplay]="autoplay && !paused()"
        [hbDelay]="1000"
        [hbSpacing]="12"
        (focusin)="paused.set(true)"
        (focusout)="resumeUnlessFocusInside($event)"
      >
        <hb-carousel-content>
          @for (tech of logos; track tech.name) {
            <hb-carousel-item class="basis-[132px] sm:basis-[176px]">
              <hb-hover-card
                class="block h-full [&>span]:flex [&>span]:h-full [&>span]:w-full"
                [hbOpenDelay]="300"
              >
                <div
                  hbHoverCardTrigger
                  tabindex="0"
                  role="group"
                  [attr.aria-label]="tech.name"
                  class="flex h-full w-full flex-col items-center gap-3 rounded-[1.2rem] border border-border bg-card px-2 pt-5 pb-3 outline-none transition-colors hover:border-tint focus-visible:border-tint"
                >
                  <img
                    data-logo-art
                    class="pixelated size-24 sm:size-32"
                    [src]="tech.src"
                    alt=""
                    width="128"
                    height="128"
                    loading="lazy"
                    decoding="async"
                  />
                  <span data-logo-card class="eyebrow text-muted-foreground">
                    {{ tech.name }}
                  </span>
                  <span class="sr-only">{{ usage()[tech.name] }}</span>
                </div>
                <hb-hover-card-content [hbWidth]="260">
                  <p class="text-sm font-medium">{{ tech.name }}</p>
                  <p class="mt-1 text-sm text-muted-foreground">{{ usage()[tech.name] }}</p>
                </hb-hover-card-content>
              </hb-hover-card>
            </hb-carousel-item>
          }
        </hb-carousel-content>
      </hb-carousel>

      <div class="mt-8 flex justify-center">
        <button
          data-expand
          type="button"
          class="inline-flex items-center gap-3 rounded-full border border-tint/60 bg-primary/30 px-6 py-3 eyebrow text-foreground transition-colors hover:bg-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          [attr.aria-expanded]="expanded()"
          aria-controls="skills-full-list"
          (click)="expanded.update((open) => !open)"
        >
          {{ expanded() ? t().collapse : t().expand }}
          <ng-icon
            name="phosphorCaretDown"
            size="14"
            aria-hidden="true"
            class="transition-transform duration-300"
            [class.rotate-180]="expanded()"
          />
        </button>
      </div>

      <div
        id="skills-full-list"
        class="grid transition-[grid-template-rows] duration-500 ease-out"
        [class.grid-rows-[1fr]]="expanded()"
        [class.grid-rows-[0fr]]="!expanded()"
        [attr.inert]="expanded() ? null : ''"
      >
        <div class="overflow-hidden">
          <div
            class="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:gap-x-12 lg:grid-cols-3"
          >
            @for (group of groups; track group.id) {
              <div>
                <h3 class="mb-4 eyebrow text-muted-foreground">{{ t().groups[group.id] }}</h3>
                <ul class="space-y-2">
                  @for (item of group.items; track item.name) {
                    <li
                      data-tech-item
                      class="flex items-center gap-3 text-base sm:text-lg font-light"
                    >
                      @if (item.src) {
                        <img
                          class="pixelated size-8"
                          [src]="item.src"
                          alt=""
                          width="32"
                          height="32"
                          loading="lazy"
                        />
                      } @else {
                        <span
                          aria-hidden="true"
                          class="grid size-8 place-items-center text-tint before:content-['+']"
                        ></span>
                      }
                      {{ item.name }}
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </div>

      <ul
        class="mt-16 grid gap-x-12 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        @for (skill of t().items; track $index) {
          <li appReveal class="reveal-left space-y-2">
            <h3
              data-skill-title
              class="text-xl md:text-2xl font-normal tracking-[-0.01em] text-tint"
            >
              {{ skill.title }}
            </h3>
            <p class="text-muted-foreground leading-relaxed">{{ skill.description }}</p>
          </li>
        }
      </ul>
    </app-page-section>
  `,
})
export class Skills {
  protected readonly logos = LOGOS;
  protected readonly groups = GROUPS;
  protected readonly t = copy('skills');
  protected readonly usage = computed(() => this.t().usage as Record<string, string>);
  protected readonly expanded = signal(false);

  protected readonly autoplay = !prefersReducedMotion();
  protected readonly paused = signal(false);

  protected resumeUnlessFocusInside(event: FocusEvent): void {
    const carousel = event.currentTarget as HTMLElement;
    this.paused.set(carousel.contains(event.relatedTarget as Node | null));
  }
}
