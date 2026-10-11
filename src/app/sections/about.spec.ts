import { TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  it('não exibe o bloco de números (stats)', () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('dl')).toBeNull();
    expect(el.textContent).not.toContain('componentes no Herbst UI');
  });

  it('título da seção sem número "[NN]" acima', () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toMatch(/\[\d+\]/);
  });

  it('texto do sobre desliza da direita (pixel art fica à esquerda)', () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p.reveal-right')).toBeTruthy();
  });
});
