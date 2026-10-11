import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Reveal } from './reveal';
import { ScrollTicker } from './scroll-ticker';

@Component({
  imports: [Reveal],
  template: `<div appReveal></div>`,
})
class Host {}

describe('Reveal', () => {
  const original = Element.prototype.getBoundingClientRect;
  let top = 1000;
  let reads = 0;

  beforeEach(() => {
    top = 1000;
    reads = 0;
    Element.prototype.getBoundingClientRect = () => (reads++, { top }) as DOMRect;
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = original;
  });

  it('liga a classe revealed ao entrar na tela, não tira mais e para de medir o elemento', () => {
    const ticker = { y: signal(0), vh: signal(1000) };
    TestBed.configureTestingModule({ providers: [{ provide: ScrollTicker, useValue: ticker }] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('div') as HTMLElement;
    const scrollTo = (t: number) => {
      top = t;
      ticker.y.update((y) => y + 1);
      fixture.detectChanges();
      return el.classList.contains('revealed');
    };

    expect(scrollTo(1000)).toBe(false);
    expect(scrollTo(850)).toBe(true);
    const readsAfterReveal = reads;
    expect(scrollTo(2000)).toBe(true);
    expect(scrollTo(3000)).toBe(true);
    expect(reads).toBe(readsAfterReveal);
  });
});
