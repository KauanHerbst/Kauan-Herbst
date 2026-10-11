import { TestBed } from '@angular/core/testing';
import { TimelineSection } from './timeline-section';
import { TimelineEntry } from '../core/content';

const ENTRIES: TimelineEntry[] = [
  { period: '2024 — atual', title: 'Dev', place: 'ACME', description: 'Fez coisas.' },
  { period: '2022 — 2024', title: 'Estagiário', place: 'Beta', description: 'Aprendeu.' },
];

describe('TimelineSection', () => {
  function render(entries: TimelineEntry[]) {
    const fixture = TestBed.createComponent(TimelineSection);
    fixture.componentRef.setInput('sectionId', 'experiencia');
    fixture.componentRef.setInput('label', 'Experiência');
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renderiza um item por entrada com título, local e período', () => {
    const el = render(ENTRIES);
    expect(el.querySelectorAll('hb-timeline-item').length).toBe(2);
    expect(el.textContent).toContain('Estagiário');
    expect(el.textContent).toContain('ACME');
    expect(el.textContent).toContain('2022 — 2024');
    expect(el.querySelector('section')?.id).toBe('experiencia');
    expect(el.querySelector('section')?.getAttribute('aria-labelledby')).toBe('experiencia-title');
  });

  it('renderiza highlights como lista quando existem', () => {
    const el = render([
      { ...ENTRIES[0], highlights: ['Migrou o sistema.', 'Criou filas no Redis.'] },
    ]);
    const items = [...el.querySelectorAll('hb-timeline-content li')].map((li) =>
      li.textContent?.trim(),
    );
    expect(items).toEqual(['Migrou o sistema.', 'Criou filas no Redis.']);
  });

  it('cada tópico desliza da esquerda quando ele próprio entra na tela', () => {
    const el = render([{ ...ENTRIES[0], highlights: ['Um.', 'Dois.'] }]);
    const items = [...el.querySelectorAll('hb-timeline-content li')];
    expect(items.length).toBe(2);
    for (const li of items) {
      expect(li.classList).toContain('reveal-left');
      expect(li.hasAttribute('appreveal')).toBe(true);
    }
  });
});
