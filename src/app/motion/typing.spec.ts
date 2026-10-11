import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TypingText, typedLength } from './typing';

describe('typedLength', () => {
  it('0 antes do delay', () => {
    expect(typedLength(100, 300, 50, 10)).toBe(0);
  });

  it('um caractere por intervalo depois do delay', () => {
    expect(typedLength(450, 300, 50, 10)).toBe(3);
  });

  it('nunca passa do tamanho do texto', () => {
    expect(typedLength(99_999, 300, 50, 10)).toBe(10);
  });
});

@Component({
  imports: [TypingText],
  template: `<h1 appTyping="Kauan Herbst"></h1>`,
})
class Host {}

describe('TypingText', () => {
  afterEach(() => {
    delete (window as Partial<Window>).matchMedia;
  });

  it('texto real fica disponível para leitores de tela desde o início', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.querySelector('.sr-only')?.textContent).toBe('Kauan Herbst');
    expect(h1.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('com reduced-motion mostra o texto completo de imediato', () => {
    window.matchMedia = ((q: string) =>
      ({ matches: q.includes('reduce'), media: q }) as MediaQueryList) as typeof window.matchMedia;
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const visual = fixture.nativeElement.querySelector('h1 [aria-hidden="true"]');
    expect(visual.textContent).toContain('Kauan Herbst');
  });

  it('reserva a altura do texto final desde o início (sem layout shift enquanto digita)', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.classList).toContain('typing');
    const ghost = h1.querySelector('[data-role="ghost"]')!;
    expect(ghost.textContent).toBe('Kauan Herbst');
    expect(ghost.getAttribute('aria-hidden')).toBe('true');
    expect(ghost.classList).toContain('invisible');
  });
});
