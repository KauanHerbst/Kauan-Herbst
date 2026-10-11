import { TestBed } from '@angular/core/testing';
import { SocialLink } from './social-link';
import { PROFILE } from '../core/content';
import pt from '../i18n/pt.json';

describe('SocialLink', () => {
  const item = PROFILE.social[0];

  function render() {
    const fixture = TestBed.createComponent(SocialLink);
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    return fixture;
  }

  it('ícone com rótulo e link externo seguro', () => {
    const a = render().nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBe(item.href);
    expect(a.getAttribute('aria-label')).toBe(item.label);
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('hover card (também no foco do teclado) mostra o @ e a frase', async () => {
    const fixture = render();
    fixture.nativeElement
      .querySelector('[data-slot="hover-card"] span')
      .dispatchEvent(new FocusEvent('focusin'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain(item.handle);
    expect(document.body.textContent).toContain(pt.profile.hints[item.label]);
  });
});
