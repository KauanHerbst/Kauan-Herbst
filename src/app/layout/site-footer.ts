import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE, SECTIONS } from '../core/content';
import { formatCoords } from '../core/coords';
import { copy } from '../i18n/i18n';
import { SocialLink } from './social-link';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SocialLink],
  template: `
    <footer class="relative z-[1] bg-background">
      <div class="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
        <div class="flex items-center gap-3">
          <img
            src="icon.png"
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
            class="pixelated size-10 rounded-lg border border-border bg-card"
          />
          <div>
            <p class="font-display text-2xl italic leading-none">{{ profile.name }}</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ about().role }}</p>
          </div>
        </div>

        <nav [attr.aria-label]="t().footer">
          <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            @for (id of sections; track id) {
              <li>
                <a
                  [href]="'#' + id"
                  class="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {{ t()[id] }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <ul class="flex items-center gap-1 md:mr-16">
          @for (item of profile.social; track item.href) {
            <li>
              <app-social-link [item]="item" />
            </li>
          }
        </ul>
      </div>

      <div class="border-t border-border">
        <div
          class="container-page flex flex-col gap-3 py-5 eyebrow text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ year }} {{ profile.name }} <span aria-hidden="true">💜</span></p>
          <p>{{ coords }} · {{ profile.city }}</p>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly profile = PROFILE;
  protected readonly sections = SECTIONS;
  protected readonly t = copy('nav');
  protected readonly about = copy('profile');
  protected readonly year = new Date().getFullYear();
  protected readonly coords = formatCoords(PROFILE.lat, PROFILE.lng);
}
