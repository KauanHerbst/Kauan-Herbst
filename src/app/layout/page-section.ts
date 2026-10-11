import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SectionId } from '../core/content';
import { copy } from '../i18n/i18n';
import { SectionStamp } from './section-stamp';

@Component({
  selector: 'app-page-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionStamp],
  host: { class: 'block' },
  template: `
    <section [id]="sectionId()" [attr.aria-labelledby]="headingId()" class="container-page">
      <app-section-stamp [label]="nav()[sectionId()]" [headingId]="headingId()" />
      <ng-content />
    </section>
  `,
})
export class PageSection {
  readonly sectionId = input.required<SectionId>();
  protected readonly nav = copy('nav');
  protected readonly headingId = computed(() => `${this.sectionId()}-title`);
}
