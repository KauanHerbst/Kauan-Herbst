import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollTicker } from '../motion/scroll-ticker';
import { BackToTop } from './back-to-top';

describe('BackToTop', () => {
  function setup() {
    const ticker = { y: signal(0), vh: signal(800) };
    TestBed.configureTestingModule({ providers: [{ provide: ScrollTicker, useValue: ticker }] });
    const fixture = TestBed.createComponent(BackToTop);
    fixture.detectChanges();
    const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { ticker, fixture, button };
  }

  it('botão fixo no canto inferior direito, com rótulo acessível', () => {
    const { button } = setup();
    expect(button().className).toMatch(/\bfixed\b/);
    expect(button().className).toMatch(/\bbottom-/);
    expect(button().className).toMatch(/\bright-/);
    expect(button().getAttribute('aria-label')).toBe('Voltar ao topo');
    expect(button().className).not.toMatch(/glow|shadow/);
  });

  it('escondido (fora do tab) no topo; aparece depois da primeira tela', async () => {
    const { ticker, fixture, button } = setup();
    expect(button().hasAttribute('inert')).toBe(true);
    ticker.y.set(900);
    await fixture.whenStable();
    expect(button().hasAttribute('inert')).toBe(false);
  });

  it('clique rola até o topo', async () => {
    const calls: unknown[] = [];
    const original = window.scrollTo;
    window.scrollTo = ((opts: unknown) => calls.push(opts)) as typeof window.scrollTo;
    const { ticker, fixture, button } = setup();
    ticker.y.set(900);
    await fixture.whenStable();
    button().click();
    window.scrollTo = original;
    expect(calls).toEqual([{ top: 0, behavior: 'smooth' }]);
  });
});
