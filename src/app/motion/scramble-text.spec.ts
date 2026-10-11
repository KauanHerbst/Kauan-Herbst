import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollTicker } from './scroll-ticker';
import { ScrambleText } from './scramble-text';

@Component({
  imports: [ScrambleText],
  template: `<h2 [appScramble]="text()"></h2>`,
})
class Host {
  text = signal('Experiência');
}

describe('ScrambleText', () => {
  afterEach(() => {
    delete (window as Partial<Window>).matchMedia;
  });

  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('mantém o texto real para leitores de tela e esconde a versão animada', () => {
    const h2: HTMLElement = render().nativeElement.querySelector('h2');
    expect(h2.querySelector('.sr-only')?.textContent).toBe('Experiência');
    const visual = h2.querySelector('[aria-hidden="true"]');
    expect(visual?.textContent).toHaveLength('Experiência'.length);
  });

  it('com reduced-motion mostra o texto final', () => {
    window.matchMedia = ((q: string) =>
      ({ matches: q.includes('reduce'), media: q }) as MediaQueryList) as typeof window.matchMedia;
    const h2: HTMLElement = render().nativeElement.querySelector('h2');
    expect(h2.querySelector('[aria-hidden="true"]')?.textContent).toBe('Experiência');
  });

  it('atualiza quando o texto muda', async () => {
    const fixture = render();
    fixture.componentInstance.text.set('Formação');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sr-only').textContent).toBe('Formação');
  });

  it('ao entrar na tela decodifica por tempo e termina sozinho, sem precisar rolar mais', async () => {
    const frames: FrameRequestCallback[] = [];
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => (frames.push(cb), frames.length));
    const rect = vi
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockReturnValue({ top: 850 } as DOMRect);
    TestBed.configureTestingModule({
      providers: [{ provide: ScrollTicker, useValue: { y: signal(0), vh: signal(1000) } }],
    });
    const fixture = render();
    await fixture.whenStable();
    const run = (ts: number) => frames.splice(0).forEach((cb) => cb(ts));
    run(0);
    run(2000);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"]').textContent).toBe(
      'Experiência',
    );
    raf.mockRestore();
    rect.mockRestore();
  });
});
