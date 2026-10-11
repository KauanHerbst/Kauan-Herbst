import { TestBed } from '@angular/core/testing';
import { Hero } from './hero';
import { PROFILE } from '../core/content';
import pt from '../i18n/pt.json';

function media({ wide, reduce }: { wide: boolean; reduce: boolean }) {
  window.matchMedia = ((q: string) => ({
    matches: q.includes('reduce') ? reduce : wide,
    media: q,
  })) as unknown as typeof window.matchMedia;
}

function render() {
  const fixture = TestBed.createComponent(Hero);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('Hero', () => {
  afterEach(() => {
    delete (window as Partial<Window>).matchMedia;
  });

  it('desktop: vídeo de fundo mudo, toca uma vez (sem loop), com capa e fontes webm/mp4, decorativo', () => {
    media({ wide: true, reduce: false });
    const el = render();
    const video = el.querySelector('video')!;
    expect(video).toBeTruthy();
    for (const attr of ['muted', 'autoplay', 'playsinline'])
      expect(video.hasAttribute(attr), attr).toBe(true);
    expect(video.hasAttribute('loop')).toBe(false);
    expect(video.hasAttribute('controls')).toBe(false);
    expect(video.getAttribute('poster')).toBe('hero/hero-desktop.webp');
    expect(video.getAttribute('aria-hidden')).toBe('true');
    expect([...video.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([
      'hero/hero-desktop.webm',
      'hero/hero-desktop.mp4',
    ]);
    expect(el.querySelector('app-ascii-art')).toBeNull();
  });

  it('desktop: propriedade muted ligada e play() chamado (o atributo sozinho não libera o autoplay)', async () => {
    media({ wide: true, reduce: false });
    const original = HTMLMediaElement.prototype.play;
    let plays = 0;
    HTMLMediaElement.prototype.play = function () {
      plays++;
      return Promise.resolve();
    };
    try {
      const fixture = TestBed.createComponent(Hero);
      fixture.detectChanges();
      await fixture.whenStable();
      const video = (fixture.nativeElement as HTMLElement).querySelector('video')!;
      expect(video.muted).toBe(true);
      expect(plays).toBeGreaterThan(0);
    } finally {
      HTMLMediaElement.prototype.play = original;
    }
  });

  it('vídeo começa invisível (cor de fundo) e só faz o fade-in quando começa a tocar', async () => {
    media({ wide: true, reduce: false });
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const video = (fixture.nativeElement as HTMLElement).querySelector('video')!;
    expect(video.classList).toContain('opacity-0');
    expect(video.classList).not.toContain('video-fade-in');
    video.dispatchEvent(new Event('playing'));
    await fixture.whenStable();
    expect(video.classList).toContain('video-fade-in');
  });

  it('se o autoplay for bloqueado, mostra a capa (não fica vazio)', async () => {
    media({ wide: true, reduce: false });
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = () => Promise.reject(new Error('NotAllowedError'));
    try {
      const fixture = TestBed.createComponent(Hero);
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
      const img = (fixture.nativeElement as HTMLElement).querySelector('img[data-hero-bg]')!;
      expect(img.classList).not.toContain('opacity-0');
    } finally {
      HTMLMediaElement.prototype.play = original;
    }
  });

  it('desktop: ao terminar o vídeo, troca para a imagem estática (crossfade por cima)', async () => {
    media({ wide: true, reduce: false });
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const img = el.querySelector('img[data-hero-bg]')!;
    expect(img.getAttribute('src')).toBe('hero/hero-desktop-static.webp');
    expect(img.classList).toContain('opacity-0');
    el.querySelector('video')!.dispatchEvent(new Event('ended'));
    await fixture.whenStable();
    expect(img.classList).not.toContain('opacity-0');
  });

  it('mobile: ao terminar, o vídeo fica parado no último frame (não troca para a imagem)', async () => {
    media({ wide: false, reduce: false });
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('video')!.dispatchEvent(new Event('ended'));
    await fixture.whenStable();
    expect(el.querySelector('img[data-hero-bg]')!.classList).toContain('opacity-0');
  });

  it('mobile: vídeo vertical abaixo do texto (fontes mobile, capa do último frame)', () => {
    media({ wide: false, reduce: false });
    const el = render();
    const video = el.querySelector('video')!;
    expect(video.closest('[data-hero-mobile-art]')).toBeTruthy();
    expect(video.getAttribute('poster')).toBe('hero/hero-mobile.webp');
    expect([...video.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([
      'hero/hero-mobile.webm',
      'hero/hero-mobile.mp4',
    ]);
    for (const attr of ['muted', 'autoplay', 'playsinline'])
      expect(video.hasAttribute(attr), attr).toBe(true);
    expect(video.hasAttribute('loop')).toBe(false);

    expect(
      el.querySelector('#hero-title')!.compareDocumentPosition(video) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('mobile com reduzir movimento: imagem estática abaixo do texto', () => {
    media({ wide: false, reduce: true });
    const el = render();
    expect(el.querySelector('video')).toBeNull();
    const img = el.querySelector('img[data-hero-bg]')!;
    expect(img.getAttribute('src')).toBe('hero/hero-mobile-static.webp');
    expect(img.closest('[data-hero-mobile-art]')).toBeTruthy();
  });

  it('reduzir movimento: imagem estática no lugar do vídeo', () => {
    media({ wide: true, reduce: true });
    const el = render();
    expect(el.querySelector('video')).toBeNull();
    expect(el.querySelector('img[data-hero-bg]')!.getAttribute('src')).toBe(
      'hero/hero-desktop-static.webp',
    );
  });

  it('mostra os ícones sociais com rótulo acessível e link externo seguro', () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const links = [
      ...fixture.nativeElement.querySelectorAll('a[aria-label]'),
    ] as HTMLAnchorElement[];
    expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(
      PROFILE.social.map((s) => s.label),
    );
    for (const a of links) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
      expect(a.querySelector('ng-icon')).toBeTruthy();
    }
  });

  it('não exibe mais o rótulo "Portfólio · ano"', () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Portfólio');
  });

  it('stack, ícones e CTAs entram da esquerda em sequência, só depois da digitação', () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const animated = [...el.querySelectorAll('.fade-left')] as HTMLElement[];

    expect(animated.length).toBe(2 + PROFILE.social.length + 2);

    const delays = animated.map((n) => parseInt(n.style.getPropertyValue('--d'), 10));
    const typingEnd = 300 + PROFILE.name.length * 70 + 250 + pt.profile.role.length * 35;
    expect(delays[0]).toBeGreaterThanOrEqual(typingEnd);
    for (let i = 1; i < delays.length; i++) expect(delays[i]).toBeGreaterThan(delays[i - 1]);
  });

  it('stack e frase em parágrafos separados (frase como complemento, abaixo)', () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const stack = el.querySelector('[data-stack]')!;
    const statement = el.querySelector('[data-statement]')!;
    expect(stack.textContent?.trim()).toBe(pt.profile.tagline);
    expect(statement.textContent?.trim()).toBe(pt.profile.statement);
    expect(stack.textContent).not.toContain(pt.profile.statement);
    expect(
      stack.compareDocumentPosition(statement) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('botão "Conhecer" com seta para baixo leva para a seção Sobre', () => {
    media({ wide: true, reduce: true });
    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cta = el.querySelector<HTMLAnchorElement>('a[href="#sobre"]')!;
    expect(cta.textContent?.trim()).toBe('Conhecer');
    expect(cta.querySelector('ng-icon[name="phosphorArrowDown"]')).toBeTruthy();
    expect(el.querySelector('a[href="#projetos"]')).toBeNull();
  });
});
