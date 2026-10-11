import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HbCarouselComponent } from '@shared/ui/carousel';
import { Skills } from './skills';
import { TECH_GROUPS, TECH_LOGOS } from '../core/content';
import pt from '../i18n/pt.json';

const SKILLS = pt.skills.items;

describe('Skills', () => {
  function render() {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    return fixture;
  }

  it('lista enxuta de habilidades (título + descrição), sem listas de ferramentas', () => {
    const el: HTMLElement = render().nativeElement;
    expect(SKILLS.length).toBeLessThanOrEqual(6);
    const titles = [...el.querySelectorAll('[data-skill-title]')].map((n) => n.textContent?.trim());
    expect(titles).toEqual(SKILLS.map((s) => s.title));
    for (const s of SKILLS) expect(el.textContent).toContain(s.description);
    expect(el.textContent).not.toContain('Certificações');
  });

  it('carrossel mostra um card por logo, cada um com pixel art e nome', () => {
    const el: HTMLElement = render().nativeElement;
    const withLogo = TECH_GROUPS.flatMap((g) => g.items).filter((i) => TECH_LOGOS[i]);
    const names = [...el.querySelectorAll('hb-carousel-item [data-logo-card]')].map((n) =>
      n.textContent?.trim(),
    );
    expect(names).toEqual(withLogo);
    const imgs = [...el.querySelectorAll('img[data-logo-art]')] as HTMLImageElement[];
    expect(imgs.map((i) => i.getAttribute('src'))).toEqual(withLogo.map((i) => TECH_LOGOS[i]));
    for (const img of imgs) {
      expect(img.classList).toContain('pixelated');
      expect(img.getAttribute('alt')).toBe('');
      expect(Number(img.getAttribute('width')) % 32).toBe(0);
    }
  });

  it('carrossel automático em loop, rápido, sem setas nem pontos', () => {
    const fixture = render();
    const carousel = fixture.debugElement.query(By.directive(HbCarouselComponent))
      .componentInstance as HbCarouselComponent;
    expect(carousel.hbAutoplay()).toBe(true);
    expect(carousel.hbLoop()).toBe(true);
    expect(carousel.hbDelay()).toBeLessThanOrEqual(1000);
    expect(
      fixture.nativeElement.querySelector(
        'hb-carousel-previous, hb-carousel-next, hb-carousel-dots',
      ),
    ).toBeNull();
  });

  it('botão (sem brilho) expande a lista completa para baixo (acessível)', async () => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    })) as unknown as typeof window.matchMedia;
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    const button = el.querySelector('button[data-expand]') as HTMLButtonElement;
    const region = el.querySelector(`#${button.getAttribute('aria-controls')}`) as HTMLElement;

    expect(button.className).not.toMatch(/glow|shadow/);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(region.hasAttribute('inert')).toBe(true);

    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(region.hasAttribute('inert')).toBe(false);
    const listed = [...region.querySelectorAll('[data-tech-item]')].map((n) =>
      n.textContent?.trim(),
    );
    expect(listed).toEqual(TECH_GROUPS.flatMap((g) => g.items));
    for (const g of TECH_GROUPS) expect(region.textContent).toContain(pt.skills.groups[g.id]);
    delete (window as Partial<Window>).matchMedia;
  });

  it('cada card do carrossel abre hover card (inclusive pelo foco) com o uso da tecnologia', async () => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    })) as unknown as typeof window.matchMedia;
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    const triggers = el.querySelectorAll('hb-carousel-item [hbHoverCardTrigger]');
    expect(triggers.length).toBe(Object.keys(TECH_LOGOS).length);
    expect(triggers[0].getAttribute('tabindex')).toBe('0');
    triggers[0]
      .closest('[data-slot="hover-card"]')!
      .querySelector('span')!
      .dispatchEvent(new FocusEvent('focusin'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain(pt.skills.usage.PHP);
    delete (window as Partial<Window>).matchMedia;
  });

  it('autoplay pausa enquanto o foco do teclado está dentro do carrossel (WCAG 2.2.2)', async () => {
    const fixture = render();
    const carousel = fixture.debugElement.query(By.directive(HbCarouselComponent));
    const instance = carousel.componentInstance as HbCarouselComponent;
    const autoplayOn = instance.hbAutoplay();
    const card = carousel.nativeElement.querySelector('[hbHoverCardTrigger]') as HTMLElement;

    card.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();
    expect(instance.hbAutoplay()).toBe(false);

    card.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
    await fixture.whenStable();
    expect(instance.hbAutoplay()).toBe(autoplayOn);
  });
});
