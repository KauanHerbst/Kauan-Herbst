import { ApplicationRef } from '@angular/core';
import { DeferBlockState, TestBed } from '@angular/core/testing';
import { LangState } from './i18n/i18n';
import { App } from './app';
import { PROFILE } from './core/content';

async function render() {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  for (const block of await fixture.getDeferBlocks()) await block.render(DeferBlockState.Complete);
  return fixture;
}

describe('App', () => {
  it('renderiza nome no h1 e âncoras das seções', async () => {
    const fixture = await render();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain(PROFILE.name);
    expect(el.querySelector('main#conteudo')).toBeTruthy();
    expect(el.querySelector('#sobre')).toBeTruthy();
  });

  it('cada seção do main (exceto o hero) é um painel de altura mínima da tela, sem divisor', async () => {
    const fixture = await render();
    const children = [
      ...(fixture.nativeElement as HTMLElement).querySelector('main#conteudo')!.children,
    ];
    const [hero, ...rest] = children;
    expect(hero.tagName.toLowerCase()).toBe('app-hero');
    expect(hero.classList).not.toContain('panel');
    expect(rest.length).toBeGreaterThanOrEqual(6);
    for (const c of rest) expect(c.classList, c.tagName).toContain('panel');
  });

  it('seção "feito com Herbst UI" vem depois do contato, antes do footer', async () => {
    const fixture = await render();
    const main = (fixture.nativeElement as HTMLElement).querySelector('main#conteudo')!;
    const tags = [...main.children].map((c) => c.tagName.toLowerCase());
    expect(tags.slice(-2)).toEqual(['app-contact', 'app-built-with']);
  });

  it('main com display contents (seções e footer no mesmo bloco, para o sticky funcionar)', async () => {
    const fixture = await render();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('main#conteudo')!.classList,
    ).toContain('contents');
  });

  it('trocar o idioma reflete na página toda: <html lang>, título e textos das seções', async () => {
    const fixture = await render();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(el.querySelector('a[href="#sobre"].fade-left')?.textContent?.trim()).toBe('Conhecer');

    TestBed.inject(LangState).set('en');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Kauan Herbst | Software Eng.');
    expect(el.querySelector('a[href="#sobre"].fade-left')?.textContent?.trim()).toBe('Explore');
    expect(el.querySelector('#sobre-title .sr-only')?.textContent).toBe('About');
    expect(el.querySelector('#experiencia h3 .sr-only')?.textContent).toBe(
      'Pleno Software Engineer',
    );
    expect(el.textContent).toContain('Shall we build something together?');
    expect(el.textContent).toContain('View project');
    expect(el.textContent).not.toContain('Ver projeto');

    TestBed.inject(LangState).set('pt');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(document.documentElement.lang).toBe('pt-BR');
    localStorage.removeItem('lang');
  });
});
