import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  afterEveryRender,
  effect,
  inject,
} from '@angular/core';
import { PROJECTS } from './core/content';
import { copy } from './i18n/i18n';
import { SiteNav } from './layout/site-nav';
import { SiteFooter } from './layout/site-footer';
import { BackToTop } from './layout/back-to-top';
import { Hero } from './sections/hero';
import { About } from './sections/about';
import { TimelineSection } from './sections/timeline-section';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';
import { Contact } from './sections/contact';
import { BuiltWith } from './sections/built-with';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteNav,
    SiteFooter,
    BackToTop,
    Hero,
    About,
    TimelineSection,
    Projects,
    Skills,
    Contact,
    BuiltWith,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly experience = copy('experience');
  protected readonly education = copy('education');
  protected readonly projects = PROJECTS;

  constructor() {
    const doc = inject(DOCUMENT);
    const meta = copy('meta');
    effect(() => {
      const m = meta();
      doc.documentElement.lang = m.htmlLang;
      doc.title = m.title;
      doc.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
    });

    const hash = doc.location.hash.slice(1);
    if (hash) {
      const scrollToHash = afterEveryRender(() => {
        const target = doc.getElementById(hash);
        if (!target) return;
        target.scrollIntoView();
        scrollToHash.destroy();
      });
    }
  }
}
