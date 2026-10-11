import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ExternalLink } from '../layout/external-link';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowUpRight,
  phosphorCheck,
  phosphorCopy,
  phosphorEnvelopeSimple,
  phosphorGithubLogo,
  phosphorInstagramLogo,
  phosphorLinkedinLogo,
} from '@ng-icons/phosphor-icons/regular';
import { HbBadgeImports } from '@shared/ui/badge';
import { HbButtonComponent } from '@shared/ui/button';
import { HbFieldImports } from '@shared/ui/field';
import { HbInputDirective } from '@shared/ui/input';
import { PROFILE } from '../core/content';
import { buildMailto } from '../core/mailto';
import { PageSection } from '../layout/page-section';
import { Reveal } from '../motion/reveal';
import { copy } from '../i18n/i18n';

const COPIED_FEEDBACK_MS = 2000;

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ExternalLink,
    HbButtonComponent,
    HbBadgeImports,
    HbFieldImports,
    HbInputDirective,
    NgIcon,
    PageSection,
    Reveal,
  ],
  viewProviders: [
    provideIcons({
      phosphorArrowUpRight,
      phosphorCheck,
      phosphorCopy,
      phosphorEnvelopeSimple,
      phosphorGithubLogo,
      phosphorInstagramLogo,
      phosphorLinkedinLogo,
    }),
  ],
  template: `
    <app-page-section sectionId="contato">
      <div class="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div appReveal class="reveal-left">
          <span
            hb-badge
            hbType="outline"
            class="gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            <span aria-hidden="true" class="size-1.5 animate-pulse rounded-full bg-tint"></span>
            {{ t().available }}
          </span>
          <p
            class="mt-6 font-display italic text-[40px] md:text-[56px] leading-[0.95] tracking-[-0.03em]"
          >
            {{ t().headline }}
          </p>
          <p class="mt-4 max-w-md text-muted-foreground leading-relaxed">
            {{ t().lead }}
          </p>

          <ul class="mt-10 divide-y divide-border border-y border-border">
            <li class="flex items-center gap-4 py-4">
              <span
                class="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-tint"
              >
                <ng-icon name="phosphorEnvelopeSimple" size="18" aria-hidden="true" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="eyebrow text-muted-foreground">{{ t().email }}</p>
                <a
                  [href]="'mailto:' + profile.email"
                  class="block truncate text-lg hover:text-tint"
                  >{{ profile.email }}</a
                >
              </div>
              <button
                hb-button
                hbType="ghost"
                hbSize="icon"
                type="button"
                data-copy-email
                [attr.aria-label]="copied() ? t().copied : t().copy"
                (click)="copyEmail()"
              >
                <ng-icon [name]="copied() ? 'phosphorCheck' : 'phosphorCopy'" aria-hidden="true" />
              </button>
            </li>
            @for (item of profile.social; track item.href) {
              <li>
                <a
                  data-channel
                  [href]="item.href"
                  appExternal
                  class="group flex items-center gap-4 py-4"
                >
                  <span
                    class="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:border-tint group-hover:text-tint"
                  >
                    <ng-icon [name]="item.icon" size="18" aria-hidden="true" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="eyebrow text-muted-foreground">{{ item.label }}</p>
                    <p class="truncate text-lg transition-colors group-hover:text-tint">
                      {{ item.handle }}
                    </p>
                  </div>
                  <ng-icon
                    name="phosphorArrowUpRight"
                    size="18"
                    aria-hidden="true"
                    class="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-tint"
                  />
                </a>
              </li>
            }
          </ul>
          <p aria-live="polite" class="sr-only">{{ copied() ? t().copied : '' }}</p>
        </div>

        <form
          appReveal
          class="reveal-right h-fit space-y-6 rounded-[1.2rem] border border-border bg-card p-6 md:p-8"
          (submit)="submit($event)"
        >
          <p class="eyebrow text-muted-foreground">{{ t().form }}</p>
          <div class="grid gap-6 sm:grid-cols-2">
            <hb-field>
              <label hb-field-label for="contato-nome" hbRequired>{{ t().name }}</label>
              <input hb-input hbFluid id="contato-nome" name="name" autocomplete="name" required />
            </hb-field>
            <hb-field>
              <label hb-field-label for="contato-email" hbRequired>{{ t().email }}</label>
              <input
                hb-input
                hbFluid
                id="contato-email"
                name="email"
                type="email"
                autocomplete="email"
                required
              />
            </hb-field>
          </div>
          <hb-field>
            <label hb-field-label for="contato-mensagem" hbRequired>{{ t().message }}</label>
            <textarea
              hb-input
              hbFluid
              id="contato-mensagem"
              name="message"
              rows="6"
              required
            ></textarea>
          </hb-field>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground">{{ t().hint }}</p>
            <button hb-button type="submit" class="gap-2">
              {{ t().send }}
              <ng-icon name="phosphorArrowUpRight" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </app-page-section>
  `,
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly copied = signal(false);
  protected readonly t = copy('contact');
  navigate: (url: string) => void = (url) => location.assign(url);

  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedTimer));
  }

  protected copyEmail(): void {
    navigator.clipboard.writeText(PROFILE.email).then(
      () => this.showCopied(),
      () => this.copied.set(false),
    );
  }

  private showCopied(): void {
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    this.navigate(
      buildMailto(PROFILE.email, this.t().subject, {
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        message: String(data.get('message') ?? ''),
      }),
    );
  }
}
