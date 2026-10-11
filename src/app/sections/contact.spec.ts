import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { PROFILE } from '../core/content';

describe('Contact', () => {
  it('ao enviar o form navega para mailto do perfil', () => {
    const fixture = TestBed.createComponent(Contact);
    const navigated: string[] = [];
    fixture.componentInstance.navigate = (u) => navigated.push(u);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('#contato-nome') as HTMLInputElement).value = 'Ana';
    (el.querySelector('#contato-email') as HTMLInputElement).value = 'ana@ex.com';
    (el.querySelector('#contato-mensagem') as HTMLTextAreaElement).value = 'Oi';
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(navigated.length).toBe(1);
    expect(navigated[0].startsWith(`mailto:${PROFILE.email}?`)).toBe(true);
    expect(decodeURIComponent(navigated[0])).toContain('Ana <ana@ex.com>');
  });

  it('labels estão ligadas aos campos e campos são obrigatórios', () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    for (const id of ['contato-nome', 'contato-email', 'contato-mensagem']) {
      expect(el.querySelector(`label[for="${id}"]`)).toBeTruthy();
      expect(el.querySelector(`#${id}`)!.hasAttribute('required')).toBe(true);
    }
  });

  it('lista os canais (e-mail + redes) com link externo seguro', () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector(`a[href="mailto:${PROFILE.email}"]`)).toBeTruthy();
    for (const s of PROFILE.social) {
      const a = el.querySelector(`a[data-channel][href="${s.href}"]`)!;
      expect(a.textContent).toContain(s.label);
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });

  it('botão copia o e-mail e anuncia "Copiado"', async () => {
    const writes: string[] = [];
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: (t: string) => (writes.push(t), Promise.resolve()) },
      configurable: true,
    });
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('button[data-copy-email]') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(writes).toEqual([PROFILE.email]);
    expect(el.querySelector('[aria-live="polite"]')?.textContent).toMatch(/copiado/i);
  });
});
