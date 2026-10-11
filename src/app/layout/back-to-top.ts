import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorArrowUp } from '@ng-icons/phosphor-icons/regular';
import { ScrollTicker, prefersReducedMotion } from '../motion/scroll-ticker';
import { copy } from '../i18n/i18n';

@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  viewProviders: [provideIcons({ phosphorArrowUp })],
  template: `
    <button
      type="button"
      [attr.aria-label]="t().backToTop"
      class="fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border border-tint/50 bg-background/80 text-tint backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:right-8 md:bottom-8"
      [class.opacity-0]="!visible()"
      [class.translate-y-4]="!visible()"
      [class.pointer-events-none]="!visible()"
      [attr.inert]="visible() ? null : ''"
      (click)="toTop()"
    >
      <ng-icon name="phosphorArrowUp" size="20" aria-hidden="true" />
    </button>
  `,
})
export class BackToTop {
  private readonly ticker = inject(ScrollTicker);
  protected readonly t = copy('nav');
  protected readonly visible = computed(() => this.ticker.y() > this.ticker.vh());

  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
