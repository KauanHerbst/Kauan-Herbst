import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorDownloadSimple,
  phosphorGlobe,
  phosphorList,
  phosphorX,
} from '@ng-icons/phosphor-icons/regular';
import { HbButtonComponent } from '@shared/ui/button';
import { HbMenuImports } from '@shared/ui/menu';
import { HbSheetImports } from '@shared/ui/sheet';
import { CV, PROFILE, SECTIONS } from '../core/content';
import { LANGUAGES, LangState, copy, isLang } from '../i18n/i18n';
import { ScrollTicker } from '../motion/scroll-ticker';
import { Flag } from './flag';
import { HeaderMenu } from './header-menu';

export const HEADER_SECTIONS = SECTIONS.filter((id) => id !== 'contato');

const READING_LINE = 0.4;

export function activeSection(tops: { id: string; top: number }[], line: number): string | null {
  let active: string | null = null;
  for (const { id, top } of tops) if (top <= line) active = id;
  return active;
}

@Component({
  selector: 'app-site-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HbButtonComponent, HbMenuImports, HbSheetImports, NgIcon, HeaderMenu, Flag],
  viewProviders: [provideIcons({ phosphorDownloadSimple, phosphorGlobe, phosphorList, phosphorX })],
  template: `
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
    >
      {{ t().skip }}
    </a>
    <header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4 md:px-8">
        <a data-brand href="#topo" class="flex shrink-0 items-center">
          <span class="font-display text-xl italic leading-none tracking-[-0.01em]">{{
            profile.name
          }}</span>
        </a>

        <nav [attr.aria-label]="t().main" class="hidden items-center gap-1 text-sm lg:flex">
          @for (id of sections; track id) {
            <a
              [href]="'#' + id"
              [attr.aria-current]="active() === id ? 'location' : null"
              class="rounded-full px-3 py-1.5 transition-colors hover:text-foreground"
              [class.bg-accent]="active() === id"
              [class.text-foreground]="active() === id"
              [class.text-muted-foreground]="active() !== id"
            >
              {{ t()[id] }}
            </a>
          }
        </nav>

        <div class="ml-auto flex items-center gap-1">
          <app-header-menu
            name="lang"
            icon="phosphorGlobe"
            [label]="t().langLabel"
            [title]="t().langTitle"
            [hint]="t().langHint"
            [menu]="langMenu"
          />
          <ng-template #langMenu>
            <hb-menu class="min-w-40">
              <hb-menu-label class="text-muted-foreground">{{ t().langTitle }}</hb-menu-label>
              <hb-menu-radio-group [hbValue]="lang.current()" (hbValueChange)="selectLang($event)">
                @for (item of langs; track item.id) {
                  <hb-menu-radio-item
                    [hbValue]="item.id"
                    [attr.data-lang]="item.id"
                    [attr.lang]="item.htmlLang"
                    class="gap-2"
                  >
                    <app-flag [code]="item.flag" />
                    {{ item.label }}
                  </hb-menu-radio-item>
                }
              </hb-menu-radio-group>
            </hb-menu>
          </ng-template>
          <app-header-menu
            name="cv"
            icon="phosphorDownloadSimple"
            [label]="t().cvLabel"
            [title]="t().cvTitle"
            [hint]="t().cvHint"
            [menu]="cvMenu"
          />
          <ng-template #cvMenu>
            <hb-menu class="min-w-40">
              <hb-menu-label class="text-muted-foreground">{{ t().cvTitle }}</hb-menu-label>
              @for (item of cv; track item.href) {
                <a
                  hb-menu-item
                  [href]="item.href"
                  [attr.download]="item.file"
                  [attr.hreflang]="item.lang"
                  >{{ item.label }}</a
                >
              }
            </hb-menu>
          </ng-template>
          <a hb-button hbSize="sm" class="ml-2" href="#contato">{{ t().contato }}</a>
          <hb-sheet
            #mobileMenu="hbSheet"
            class="relative"
            hbSide="right"
            hbSize="18rem"
            [hbTitle]="t().menu"
            [hbShowClose]="false"
            [hbShowFooter]="false"
          >
            <button
              hbSheetTrigger
              data-mobile-menu
              type="button"
              class="icon-btn lg:hidden"
              aria-haspopup="dialog"
              [attr.aria-label]="t().openMenu"
            >
              <ng-icon name="phosphorList" size="20" aria-hidden="true" />
            </button>
            <div hbSheetContent>
              <button
                data-close-menu
                type="button"
                class="icon-btn absolute top-4 right-4"
                [attr.aria-label]="t().closeMenu"
                (click)="mobileMenu.close()"
              >
                <ng-icon name="phosphorX" size="18" aria-hidden="true" />
              </button>
              <nav [attr.aria-label]="t().main">
                <ul class="-mx-3 space-y-1">
                  @for (id of allSections; track id) {
                    <li>
                      <a
                        [href]="'#' + id"
                        [attr.aria-current]="active() === id ? 'location' : null"
                        class="block rounded-lg px-3 py-3 text-lg transition-colors hover:bg-accent hover:text-foreground"
                        [class.bg-accent]="active() === id"
                        [class.text-foreground]="active() === id"
                        [class.text-muted-foreground]="active() !== id"
                        (click)="mobileMenu.close()"
                      >
                        {{ t()[id] }}
                      </a>
                    </li>
                  }
                </ul>
              </nav>
            </div>
          </hb-sheet>
        </div>
      </div>
    </header>
  `,
})
export class SiteNav {
  protected readonly sections = HEADER_SECTIONS;
  protected readonly allSections = SECTIONS;
  protected readonly profile = PROFILE;
  protected readonly cv = CV;
  protected readonly t = copy('nav');
  protected readonly lang = inject(LangState);

  protected readonly langs = LANGUAGES;

  protected selectLang(value: unknown): void {
    if (isLang(value)) this.lang.set(value);
  }

  private readonly ticker = inject(ScrollTicker);

  protected readonly active = computed(() => {
    this.ticker.y();
    if (!this.ticker.vh()) return null;
    const tops = SECTIONS.map((id) => {
      const el = document.getElementById(id);
      const box = el?.closest('.panel') ?? el;
      return { id, top: box?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY };
    });
    return activeSection(tops, this.ticker.vh() * READING_LINE);
  });
}
