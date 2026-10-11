import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollTicker } from '../motion/scroll-ticker';
import { HEADER_SECTIONS, SiteNav, activeSection } from './site-nav';
import { CV, PROFILE, SECTIONS } from '../core/content';

describe('activeSection', () => {
  const tops = [
    { id: 'sobre', top: 900 },
    { id: 'experiencia', top: 1800 },
    { id: 'formacao', top: 2600 },
  ];

  it('nenhuma ativa enquanto a primeira seção não chega na linha de leitura', () => {
    expect(activeSection(tops, 120)).toBeNull();
  });

  it('ativa a última seção cujo topo já passou da linha', () => {
    expect(
      activeSection(
        tops.map((t) => ({ ...t, top: t.top - 1000 })),
        120,
      ),
    ).toBe('sobre');
    expect(
      activeSection(
        tops.map((t) => ({ ...t, top: t.top - 1900 })),
        120,
      ),
    ).toBe('experiencia');
  });
});

describe('SiteNav', () => {
  it('marca a seção cujo painel ocupa a tela, mesmo com a <section> interna ainda abaixo (padding do painel)', () => {
    const layout: Record<string, { panel: number; inner: number }> = {
      sobre: { panel: -3000, inner: -2850 },
      experiencia: { panel: -2000, inner: -1850 },
      formacao: { panel: -900, inner: -750 },
      projetos: { panel: 60, inner: 210 },
      skills: { panel: 1200, inner: 1350 },
      contato: { panel: 2400, inner: 2550 },
    };
    const panels: HTMLElement[] = [];
    for (const [id, pos] of Object.entries(layout)) {
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.getBoundingClientRect = () => ({ top: pos.panel }) as DOMRect;
      const section = document.createElement('section');
      section.id = id;
      section.getBoundingClientRect = () => ({ top: pos.inner }) as DOMRect;
      panel.append(section);
      document.body.append(panel);
      panels.push(panel);
    }
    try {
      const ticker = { y: signal(0), vh: signal(800) };
      TestBed.configureTestingModule({ providers: [{ provide: ScrollTicker, useValue: ticker }] });
      const fixture = TestBed.createComponent(SiteNav);
      fixture.detectChanges();
      expect(
        (fixture.nativeElement as HTMLElement)
          .querySelector('nav a[aria-current]')
          ?.textContent?.trim(),
      ).toBe('Projetos');
    } finally {
      panels.forEach((p) => p.remove());
    }
  });

  it('nenhum link ativo depois que o Contato (fora do menu) passa da linha de leitura', async () => {
    const ids = ['sobre', 'experiencia', 'formacao', 'projetos', 'skills', 'contato'];
    const tops: Record<string, number> = {
      sobre: -4000,
      experiencia: -3000,
      formacao: -2000,
      projetos: -1000,
      skills: -500,
      contato: 50,
    };
    for (const id of ids) {
      const el = document.createElement('section');
      el.id = id;
      el.getBoundingClientRect = () => ({ top: tops[id] }) as DOMRect;
      document.body.append(el);
    }
    const ticker = { y: signal(0), vh: signal(800) };
    TestBed.configureTestingModule({ providers: [{ provide: ScrollTicker, useValue: ticker }] });
    const fixture = TestBed.createComponent(SiteNav);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('nav a[aria-current]')).toBeNull();
    for (const id of ids) document.getElementById(id)!.remove();
  });

  function render() {
    TestBed.configureTestingModule({
      providers: [{ provide: ScrollTicker, useValue: { y: signal(0), vh: signal(800) } }],
    });
    const fixture = TestBed.createComponent(SiteNav);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('marca com nome em display (sem badge de disponibilidade) e links de seção', () => {
    const el = render();
    const brand = el.querySelector('[data-brand]')!;
    expect(brand.textContent).toContain(PROFILE.name);
    expect(brand.querySelector('.font-display')).toBeTruthy();
    expect(el.textContent).not.toMatch(/dispon[ií]vel/i);
    const hrefs = [...el.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    for (const id of HEADER_SECTIONS) expect(hrefs).toContain('#' + id);
  });

  it('sem ícones sociais no header, só o botão de contato', () => {
    const el = render();
    expect(el.querySelector('[data-header-social]')).toBeNull();
    for (const label of ['GitHub', 'LinkedIn'])
      expect(el.querySelector(`a[aria-label="${label}"]`)).toBeNull();
    expect(el.querySelector('a[href="#contato"]')?.textContent).toContain('Contato');
  });

  it('não tem barra nem texto de loading', () => {
    const el = render();
    expect(el.querySelector('[data-loading-bar]')).toBeNull();
    expect(el.textContent).not.toMatch(/loading/i);
  });

  it('botão Currículo abre menu para baixar a versão em português ou inglês', async () => {
    const el = render();
    const trigger = el.querySelector<HTMLButtonElement>('button[data-trigger="cv"]')!;

    expect(trigger.textContent?.trim()).toBe('');
    expect(trigger.getAttribute('aria-label')).toBe('Baixar currículo');
    expect(trigger.classList).toContain('icon-btn');
    expect(trigger.closest('hb-hover-card')).toBeTruthy();
    trigger.click();
    await TestBed.inject(ApplicationRef).whenStable();
    expect(
      document.querySelector('[data-slot="menu"] [data-slot="menu-label"]')?.textContent?.trim(),
    ).toBe('Currículo');
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>('[data-slot="menu"] a[download]'),
    ];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(CV.map((c) => c.href));
    expect(links.map((a) => a.textContent?.trim())).toEqual(CV.map((c) => c.label));
  });

  it('botão de idioma: ícone de globo abre lista "{bandeira} Língua"; escolher inglês traduz e salva', async () => {
    localStorage.removeItem('lang');
    const el = render();
    const appRef = TestBed.inject(ApplicationRef);
    const btn = el.querySelector<HTMLButtonElement>('button[data-trigger="lang"]')!;

    expect(
      btn.compareDocumentPosition(el.querySelector('[data-trigger="cv"]')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(btn.querySelector('ng-icon')).toBeTruthy();
    expect(btn.querySelector('[data-flag]')).toBeNull();
    expect(btn.getAttribute('aria-label')).toBe('Mudar idioma');

    btn
      .closest('[data-slot="hover-card"]')!
      .querySelector('span')!
      .dispatchEvent(new FocusEvent('focusin'));
    await appRef.whenStable();
    expect(document.body.textContent).toContain('Veja o portfólio em português ou inglês.');

    const open = async () => {
      btn.click();
      await appRef.whenStable();
      return [...document.querySelectorAll<HTMLElement>('[data-slot="menu"] [data-lang]')];
    };
    let options = await open();
    expect(
      document.querySelector('[data-slot="menu"] [data-slot="menu-label"]')?.textContent?.trim(),
    ).toBe('Idioma');
    expect(options.map((o) => o.textContent?.trim())).toEqual(['Português', 'English']);
    expect(options.map((o) => o.querySelector('[data-flag]')?.getAttribute('data-flag'))).toEqual([
      'br',
      'us',
    ]);
    expect(options[0].getAttribute('aria-checked')).toBe('true');

    options[1].click();
    await appRef.whenStable();
    expect([...el.querySelectorAll('nav a')].map((a) => a.textContent?.trim())).toEqual([
      'About',
      'Experience',
      'Education',
      'Projects',
      'Skills',
    ]);
    expect(btn.getAttribute('aria-label')).toBe('Change language');
    expect(localStorage.getItem('lang')).toBe('en');

    options = await open();
    expect(
      document.querySelector('[data-slot="menu"] [data-slot="menu-label"]')?.textContent?.trim(),
    ).toBe('Language');
    expect(options[1].getAttribute('aria-checked')).toBe('true');
    options[0].click();
    await appRef.whenStable();
    expect(localStorage.getItem('lang')).toBe('pt');
    localStorage.removeItem('lang');
  });

  it('clique (foco vindo do ponteiro) não abre o hover card por cima do botão: o menu precisa receber o clique', async () => {
    const el = render();
    const span = el
      .querySelector('[data-trigger="lang"]')!
      .closest('[data-slot="hover-card"]')!
      .querySelector('span')!;
    span.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    span.dispatchEvent(new FocusEvent('focusin'));
    await TestBed.inject(ApplicationRef).whenStable();
    expect(document.body.textContent).not.toContain('Veja o portfólio em português ou inglês.');
  });

  it('menu do celular: botão (só abaixo de lg) abre painel com todas as seções e fecha ao escolher uma', async () => {
    const el = render();
    const appRef = TestBed.inject(ApplicationRef);
    const trigger = el.querySelector<HTMLButtonElement>('button[data-mobile-menu]')!;
    expect(trigger.getAttribute('aria-label')).toBe('Abrir menu');
    expect(trigger.classList).toContain('lg:hidden');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');

    trigger.click();
    await appRef.whenStable();
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog).toBeTruthy();
    const links = [...dialog.querySelectorAll<HTMLAnchorElement>('nav a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(SECTIONS.map((id) => '#' + id));
    expect(links.map((a) => a.textContent?.trim())).toEqual([
      'Sobre',
      'Experiência',
      'Formação',
      'Projetos',
      'Skills',
      'Contato',
    ]);
    expect(dialog.querySelector('button[data-close-menu]')?.getAttribute('aria-label')).toBe(
      'Fechar menu',
    );

    links[3].click();
    await appRef.whenStable();
    await new Promise((r) => setTimeout(r, 400));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
