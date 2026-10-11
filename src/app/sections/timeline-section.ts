import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HbTimelineImports } from '@shared/ui/timeline';
import { SectionId, TimelineEntry } from '../core/content';
import { PageSection } from '../layout/page-section';
import { ScrambleText } from '../motion/scramble-text';
import { Reveal } from '../motion/reveal';

@Component({
  selector: 'app-timeline-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HbTimelineImports, PageSection, ScrambleText, Reveal],
  template: `
    <app-page-section [sectionId]="sectionId()">
      @if (entries().length) {
        <hb-timeline
          hbAlign="right"
          class="[&_[data-slot=timeline-opposite-zone]]:flex-none [&_[data-slot=timeline-opposite-zone]]:basis-auto [&_[data-slot=timeline-opposite-zone]]:w-24 md:[&_[data-slot=timeline-opposite-zone]]:w-48 [&_[data-slot=timeline-content-zone]]:overflow-x-clip"
        >
          @for (entry of entries(); track $index) {
            <hb-timeline-item>
              <hb-timeline-marker hbColor="primary" hbVariant="outline" />
              <hb-timeline-opposite>
                <span class="eyebrow text-muted-foreground md:whitespace-nowrap">
                  {{ entry.period }}
                </span>
              </hb-timeline-opposite>
              <hb-timeline-content>
                <div class="pb-12 max-w-2xl">
                  <h3
                    class="text-xl md:text-2xl font-normal tracking-[-0.01em]"
                    [appScramble]="entry.title"
                  ></h3>
                  <p appReveal class="reveal-left text-tint mt-1">{{ entry.place }}</p>
                  @if (entry.description) {
                    <p appReveal class="reveal-left text-muted-foreground mt-3 leading-relaxed">
                      {{ entry.description }}
                    </p>
                  }
                  @if (entry.highlights?.length) {
                    <ul class="mt-4 space-y-2 text-muted-foreground leading-relaxed">
                      @for (item of entry.highlights; track item) {
                        <li
                          appReveal
                          class="reveal-left flex gap-3 before:content-['+'] before:text-tint"
                        >
                          {{ item }}
                        </li>
                      }
                    </ul>
                  }
                </div>
              </hb-timeline-content>
            </hb-timeline-item>
          }
        </hb-timeline>
      }
    </app-page-section>
  `,
})
export class TimelineSection {
  readonly sectionId = input.required<SectionId>();
  readonly entries = input.required<TimelineEntry[]>();
}
