import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExternalLink } from './external-link';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorGithubLogo,
  phosphorInstagramLogo,
  phosphorLinkedinLogo,
} from '@ng-icons/phosphor-icons/regular';
import { HbHoverCardImports } from '@shared/ui/hover-card';
import { SocialIcon } from '../core/content';
import { copy } from '../i18n/i18n';

@Component({
  selector: 'app-social-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExternalLink, NgIcon, HbHoverCardImports],
  viewProviders: [
    provideIcons({ phosphorGithubLogo, phosphorInstagramLogo, phosphorLinkedinLogo }),
  ],
  host: { class: 'inline-flex' },
  template: `
    <hb-hover-card [hbOpenDelay]="300">
      <a
        hbHoverCardTrigger
        [class]="linkClass()"
        [href]="item().href"
        appExternal
        [attr.aria-label]="item().label"
      >
        <ng-icon [name]="item().icon" [size]="iconSize()" aria-hidden="true" />
      </a>
      <hb-hover-card-content [hbWidth]="240">
        <p class="text-sm font-medium">{{ item().handle }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ hints().hints[item().label] }}</p>
      </hb-hover-card-content>
    </hb-hover-card>
  `,
})
export class SocialLink {
  readonly item = input.required<SocialIcon>();
  protected readonly hints = copy('profile');
  readonly linkClass = input('icon-btn');
  readonly iconSize = input('18');
}
