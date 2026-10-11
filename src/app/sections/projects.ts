import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExternalLink } from '../layout/external-link';
import { HbBadgeImports } from '@shared/ui/badge';
import { HbButtonComponent } from '@shared/ui/button';
import { HbCardImports } from '@shared/ui/card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorArrowUpRight, phosphorGithubLogo } from '@ng-icons/phosphor-icons/regular';
import { PixelReveal } from '../art/pixel-reveal';
import { Reveal } from '../motion/reveal';
import { Project } from '../core/content';
import { PageSection } from '../layout/page-section';
import { copy } from '../i18n/i18n';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ phosphorArrowUpRight, phosphorGithubLogo })],
  imports: [
    ExternalLink,
    HbCardImports,
    HbBadgeImports,
    HbButtonComponent,
    PixelReveal,
    Reveal,
    PageSection,
    NgIcon,
  ],
  template: `
    <app-page-section sectionId="projetos">
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (project of projects(); track project.id) {
          <li appReveal [class.reveal-left]="$even" [class.reveal-right]="$odd">
            <hb-card class="h-full rounded-[1.2rem] border border-border bg-card shadow-none">
              @if (project.image) {
                <div class="flex justify-center border-b border-border py-6">
                  <app-pixel-reveal [src]="project.image" alt="" [scale]="2" [seed]="$index + 11" />
                </div>
              }
              <hb-card-header>
                @if (project.team) {
                  <p class="eyebrow text-tint">{{ t().team }}</p>
                }
                <h3 hb-card-title class="text-xl font-normal">{{ t().items[project.id].name }}</h3>
                <hb-card-description>{{ t().items[project.id].description }}</hb-card-description>
              </hb-card-header>
              <hb-card-content>
                <ul class="flex flex-wrap gap-2" [attr.aria-label]="t().tech">
                  @for (tech of project.stack; track tech) {
                    <li>
                      <hb-badge hbType="outline">{{ tech }}</hb-badge>
                    </li>
                  }
                </ul>
              </hb-card-content>
              @if (project.url || project.repos?.length) {
                <hb-card-footer hbBorder class="mt-auto grid grid-cols-2 gap-2">
                  @if (project.url) {
                    <a
                      hb-button
                      hbSize="sm"
                      class="w-full gap-2"
                      [class.col-span-2]="project.repos?.length !== 1"
                      [href]="project.url"
                      appExternal
                    >
                      {{ t().view }}
                      <ng-icon name="phosphorArrowUpRight" aria-hidden="true" />
                    </a>
                  }
                  @for (repo of project.repos ?? []; track repo.href) {
                    <a
                      hb-button
                      hbType="outline"
                      hbSize="sm"
                      class="w-full gap-2"
                      [class.col-span-2]="!project.url && project.repos?.length === 1"
                      [href]="repo.href"
                      appExternal
                    >
                      <ng-icon name="phosphorGithubLogo" aria-hidden="true" />
                      {{ repo.label ?? t().code }}
                    </a>
                  }
                </hb-card-footer>
              }
            </hb-card>
          </li>
        }
      </ul>
    </app-page-section>
  `,
})
export class Projects {
  readonly projects = input.required<Project[]>();
  protected readonly t = copy('projects');
}
