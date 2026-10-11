import { TestBed } from '@angular/core/testing';
import { BuiltWith } from './built-with';
import { SECTIONS } from '../core/content';

describe('BuiltWith', () => {
  function render() {
    const fixture = TestBed.createComponent(BuiltWith);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('fala do Herbst UI com heading e texto', () => {
    const el = render();
    expect(el.querySelector('h2')?.textContent).toContain('Herbst UI');
    expect(el.textContent).toMatch(/portfólio/i);
  });

  it('botão para conhecer a biblioteca (link externo seguro)', () => {
    const el = render();
    const a = el.querySelector('a[href="https://ui.kauanherbst.dev"]')!;
    expect(a.textContent).toMatch(/conhecer/i);
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('folhas caindo em canvas decorativo (escondido de leitores de tela)', () => {
    const leaves = render().querySelector('app-purple-leaves')!;
    expect(leaves.getAttribute('aria-hidden')).toBe('true');
    expect(leaves.querySelector('canvas')).toBeTruthy();
  });

  it('não aparece no menu do header', () => {
    expect(SECTIONS as readonly string[]).not.toContain('feito-com');
  });

  it('fica fixa (sticky, altura da tela) a partir do md para o footer cobrir', () => {
    const fixture = TestBed.createComponent(BuiltWith);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.className).toContain('md:sticky');
    expect(host.className).toContain('md:top-14');
    expect(host.className).toContain('md:h-[calc(100svh-3.5rem)]');
  });
});
