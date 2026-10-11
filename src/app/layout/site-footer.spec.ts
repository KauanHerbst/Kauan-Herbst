import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';
import { SECTIONS } from '../core/content';
import { PROFILE } from '../core/content';
import pt from '../i18n/pt.json';
import { formatCoords } from '../core/coords';

describe('SiteFooter', () => {
  function render() {
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('não menciona o Herbst UI', () => {
    const el = render();
    expect(el.textContent).not.toContain('Herbst UI');
    expect(el.querySelector('a[href*="ui.kauanherbst.dev"]')).toBeNull();
  });

  it('marca, links das seções, ícones sociais com rótulo e link externo seguro', () => {
    const el = render();
    expect(el.textContent).toContain(PROFILE.name);
    expect(el.textContent).toContain(pt.profile.role);
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const id of SECTIONS) expect(hrefs).toContain('#' + id);
    for (const s of PROFILE.social) {
      const a = el.querySelector(`a[aria-label="${s.label}"]`)!;
      expect(a.getAttribute('href')).toBe(s.href);
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });

  it('linha final com ano e coordenadas; "voltar ao topo" saiu (agora é botão flutuante)', () => {
    const el = render();
    expect(el.textContent).toContain(String(new Date().getFullYear()));
    expect(el.textContent).toContain(formatCoords(PROFILE.lat, PROFILE.lng));
    expect(el.textContent).not.toMatch(/voltar ao topo/i);
  });

  it('desliza por cima da última seção: relative, z-index acima e fundo opaco', () => {
    const footer = render().querySelector('footer')!;
    for (const c of ['relative', 'z-[1]', 'bg-background']) expect(footer.classList).toContain(c);
  });
});
