import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorArrowDown } from '@ng-icons/phosphor-icons/regular';
import { HbButtonComponent } from '@shared/ui/button';
import { PROFILE } from '../core/content';
import { copy } from '../i18n/i18n';
import { TypingText } from '../motion/typing';
import { prefersReducedMotion } from '../motion/scroll-ticker';
import { SocialLink } from '../layout/social-link';

const NAME_DELAY = 300;
const NAME_SPEED = 70;
const ROLE_GAP = 250;
const ROLE_SPEED = 35;
const STAGGER = 120;
const ROLE_DELAY = NAME_DELAY + PROFILE.name.length * NAME_SPEED + ROLE_GAP;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HbButtonComponent, NgIcon, NgTemplateOutlet, TypingText, SocialLink],
  viewProviders: [provideIcons({ phosphorArrowDown })],
  template: `
    <section id="topo" aria-labelledby="hero-title" class="relative overflow-hidden">
      @if (rendered() && wide) {
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <ng-container
            [ngTemplateOutlet]="art"
            [ngTemplateOutletContext]="{ position: 'object-right' }"
          />
          <div
            class="absolute inset-0 bg-linear-to-r from-background via-background/70 via-40% to-transparent to-70%"
          ></div>
          <div
            class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent"
          ></div>
        </div>
      }

      <div
        class="container-page relative grid min-h-[calc(100dvh-4rem)] items-start gap-12 pt-16 pb-16 md:items-center"
      >
        <div class="relative z-10 max-w-xl space-y-8">
          <h1 id="hero-title" class="space-y-2">
            <span
              class="block font-display italic text-[56px] md:text-[96px] leading-[0.85] tracking-[-0.03em]"
              [appTyping]="profile.name"
              [appTypingDelay]="nameDelay"
              [appTypingSpeed]="nameSpeed"
            ></span>
            <span
              class="block text-2xl md:text-[32px] font-light tracking-[-0.01em] text-muted-foreground"
              [appTyping]="p().role"
              [appTypingDelay]="roleDelay()"
              [appTypingSpeed]="roleSpeed"
              [appTypingKeepCaret]="true"
            ></span>
          </h1>
          <div class="space-y-3">
            <p data-stack class="fade-left max-w-md text-lg font-light" [style.--d]="enter(0)">
              {{ p().tagline }}
            </p>
            <p
              data-statement
              class="fade-left max-w-md text-muted-foreground leading-relaxed"
              [style.--d]="enter(1)"
            >
              {{ p().statement }}
            </p>
          </div>
          <ul class="flex items-center gap-2" [attr.aria-label]="t().social">
            @for (item of profile.social; track item.href; let i = $index) {
              <li class="fade-left" [style.--d]="enter(i + 2)">
                <app-social-link
                  [item]="item"
                  iconSize="20"
                  linkClass="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-tint hover:text-tint"
                />
              </li>
            }
          </ul>
          <div class="flex flex-wrap gap-3">
            <a
              hb-button
              hbSize="lg"
              href="#sobre"
              class="fade-left"
              [style.--d]="enter(profile.social.length + 2)"
            >
              {{ t().cta }}
              <ng-icon name="phosphorArrowDown" size="18" aria-hidden="true" />
            </a>
            <a
              hb-button
              hbType="outline"
              hbSize="lg"
              href="#contato"
              class="fade-left"
              [style.--d]="enter(profile.social.length + 3)"
            >
              {{ t().talk }}
            </a>
          </div>
        </div>
        @if (rendered() && !wide) {
          <div
            data-hero-mobile-art
            aria-hidden="true"
            class="relative -mx-4 -mt-56 -mb-16 h-[70vh] overflow-hidden"
          >
            <ng-container
              [ngTemplateOutlet]="art"
              [ngTemplateOutletContext]="{ position: 'object-bottom' }"
            />
            <div
              class="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-background to-transparent"
            ></div>
            <div
              class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent"
            ></div>
          </div>
        }
      </div>
    </section>

    <ng-template #art let-position="position">
      <div class="relative size-full">
        @if (showVideo) {
          <video
            #bgVideo
            [class]="'absolute inset-0 size-full object-cover ' + position"
            [class.opacity-0]="!playing() && !blocked()"
            [class.video-fade-in]="playing()"
            (playing)="playing.set(true)"
            (ended)="ended.set(true)"
            autoplay
            muted
            [muted]="true"
            playsinline
            preload="auto"
            tabindex="-1"
            aria-hidden="true"
            [attr.poster]="'hero/hero-' + kind + '.webp'"
          >
            <source [attr.src]="'hero/hero-' + kind + '.webm'" type="video/webm" />
            <source [attr.src]="'hero/hero-' + kind + '.mp4'" type="video/mp4" />
          </video>
        }
        <img
          data-hero-bg
          [class]="
            'absolute inset-0 size-full object-cover transition-opacity duration-[600ms] ' +
            position
          "
          [class.opacity-0]="!showStatic()"
          [src]="'hero/hero-' + kind + '-static.webp'"
          alt=""
        />
      </div>
    </ng-template>
  `,
})
export class Hero {
  protected readonly profile = PROFILE;
  protected readonly nameDelay = NAME_DELAY;
  protected readonly nameSpeed = NAME_SPEED;
  protected readonly roleSpeed = ROLE_SPEED;
  protected readonly p = copy('profile');
  protected readonly t = copy('hero');

  protected readonly roleDelay = linkedSignal<string, number>({
    source: () => this.p().role,
    computation: (_, prev) => (prev ? 0 : ROLE_DELAY),
  });
  private readonly typingEnd = ROLE_DELAY + this.p().role.length * ROLE_SPEED;

  protected readonly enter = (n: number) => `${this.typingEnd + n * STAGGER}ms`;

  protected readonly wide =
    typeof matchMedia === 'function' && matchMedia('(min-width: 48rem)').matches;
  protected readonly kind = this.wide ? 'desktop' : 'mobile';
  protected readonly showVideo = !prefersReducedMotion();

  private readonly bgVideo = viewChild<ElementRef<HTMLVideoElement>>('bgVideo');

  protected readonly playing = signal(false);

  protected readonly blocked = signal(false);

  protected readonly ended = signal(false);
  protected readonly showStatic = computed(
    () => !this.showVideo || this.blocked() || (this.wide && this.ended()),
  );

  protected readonly rendered = signal(false);

  constructor() {
    afterNextRender(() => this.rendered.set(true));
    effect(() => {
      const video = this.bgVideo()?.nativeElement;
      if (!video) return;
      video.muted = true;
      video.play()?.catch(() => this.blocked.set(true));
    });
  }
}
