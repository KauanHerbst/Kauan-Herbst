import { TestBed } from '@angular/core/testing';
import { Projects } from './projects';
import { PROJECTS, Project } from '../core/content';
import pt from '../i18n/pt.json';
import en from '../i18n/en.json';

function visibleText(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('.sr-only').forEach((n) => n.remove());
  return clone.textContent?.trim() ?? '';
}

describe('Projects', () => {
  function render(projects: Project[]) {
    const fixture = TestBed.createComponent(Projects);
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renderiza card com nome, stack e links externos seguros', () => {
    const el = render([
      {
        id: 'herbst-ui',
        stack: ['Angular', 'Tailwind'],
        url: 'https://ui.kauanherbst.dev',
        repos: [{ href: 'https://github.com/x/y' }],
      },
    ]);
    expect(el.textContent).toContain('Herbst UI');
    expect(el.querySelectorAll('hb-badge').length).toBe(2);
    const links = [...el.querySelectorAll('a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://ui.kauanherbst.dev',
      'https://github.com/x/y',
    ]);
    for (const a of links) expect(a.getAttribute('rel')).toContain('noopener');
    expect(links[0].textContent).toContain('Ver projeto');
    expect(links[1].textContent).toContain('Ver código');
    for (const a of links) expect(a.querySelector('ng-icon')).toBeTruthy();
  });

  it('projeto com front e back separados mostra um botão de código para cada', () => {
    const el = render([
      {
        id: 'literium',
        stack: [],
        repos: [
          { label: 'Front-end', href: 'https://github.com/a/front' },
          { label: 'Back-end', href: 'https://github.com/a/back' },
        ],
      },
    ]);
    const links = [...el.querySelectorAll('a')];
    expect(links.map(visibleText)).toEqual(['Front-end', 'Back-end']);
    expect(
      links.every((a) => a.querySelector('.sr-only')?.textContent === ' (abre em nova aba)'),
    ).toBe(true);
  });

  it('projeto em equipe mostra a etiqueta', () => {
    const el = render([{ id: 'trips', stack: [], team: true }]);
    expect(el.textContent).toContain('Em equipe · Santander Coders');
  });

  it('nome do projeto é heading h3 (navegação por headings)', () => {
    const el = render([{ id: 'trips', stack: [] }]);
    expect(el.querySelector('h3')?.textContent?.trim()).toBe('Gerenciador de viagens');
  });

  it('projeto sem url/repo/imagem não renderiza links nem img', () => {
    const el = render([{ id: 'ecommerce', stack: [] }]);
    expect(el.querySelectorAll('a').length).toBe(0);
    expect(el.querySelector('img')).toBeNull();
  });

  it('conteúdo real: Herbst UI, Literium, Vortex Bank e os dois do Santander Coders, todos com pixel art e código', () => {
    expect(PROJECTS.map((p) => pt.projects.items[p.id].name)).toEqual([
      'Herbst UI',
      'Literium',
      'Vortex Bank',
      'Gerenciador de viagens',
      'E-commerce Santander Coders',
    ]);
    for (const p of PROJECTS) {
      expect(p.image, p.id).toMatch(/^art\//);
      expect(p.repos?.length, p.id).toBeGreaterThan(0);
      for (const copy of [pt, en])
        expect(copy.projects.items[p.id].description, p.id).not.toContain('—');
    }
  });
});
