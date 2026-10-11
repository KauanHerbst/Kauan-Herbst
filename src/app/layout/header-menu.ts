import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HbHoverCardImports } from '@shared/ui/hover-card';
import { HbMenuImports } from '@shared/ui/menu';

@Component({
  selector: 'app-header-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HbHoverCardImports, HbMenuImports, NgIcon],
  host: { class: 'inline-flex' },
  template: `
    <hb-hover-card #card="hbHoverCard" [hbOpenDelay]="300">
      <button
        hbHoverCardTrigger
        type="button"
        class="icon-btn"
        [attr.data-trigger]="name()"
        [attr.aria-label]="label()"
        [hbMenuTriggerFor]="menu()"
        (hbOpenChange)="$event && card.close()"
      >
        <ng-icon [name]="icon()" size="18" aria-hidden="true" />
      </button>
      <hb-hover-card-content [hbWidth]="240">
        <p class="text-sm font-medium">{{ title() }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ hint() }}</p>
      </hb-hover-card-content>
    </hb-hover-card>
  `,
})
export class HeaderMenu {
  readonly name = input.required<string>();
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly hint = input.required<string>();
  readonly menu = input.required<TemplateRef<unknown>>();
}
