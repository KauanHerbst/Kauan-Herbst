import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LangState } from '../i18n/i18n';
import { ExternalLink } from './external-link';

@Component({
  imports: [ExternalLink],
  template: `<a appExternal href="https://example.com">Site</a>`,
})
class Host {}

describe('ExternalLink', () => {
  it('abre em nova aba com rel seguro e avisa o leitor de tela no idioma ativo', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a.querySelector('.sr-only')?.textContent).toBe(' (abre em nova aba)');

    TestBed.inject(LangState).set('en');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(a.querySelector('.sr-only')?.textContent).toBe(' (opens in a new tab)');
    TestBed.inject(LangState).set('pt');
    localStorage.removeItem('lang');
  });
});
