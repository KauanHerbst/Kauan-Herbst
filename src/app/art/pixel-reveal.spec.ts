import { TestBed } from '@angular/core/testing';
import { PixelReveal } from './pixel-reveal';

describe('PixelReveal', () => {
  function render(alt: string) {
    const fixture = TestBed.createComponent(PixelReveal);
    fixture.componentRef.setInput('src', 'art/nao-existe.png');
    fixture.componentRef.setInput('alt', alt);
    fixture.componentRef.setInput('scale', 3);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('canvas nativo 64x64 escalado por inteiro, com rótulo acessível', () => {
    const canvas = render('Mesa de trabalho').querySelector('canvas')!;
    expect(canvas.width).toBe(64);
    expect(canvas.style.width).toBe('192px');
    expect(canvas.classList).toContain('pixelated');
    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Mesa de trabalho');
  });

  it('alt vazio = decorativo (aria-hidden)', () => {
    const canvas = render('').querySelector('canvas')!;
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
    expect(canvas.getAttribute('role')).toBeNull();
  });

  it('sem rótulo de status (Loading/Ready)', () => {
    expect(render('x').textContent).not.toMatch(/loading|ready/i);
  });
});
