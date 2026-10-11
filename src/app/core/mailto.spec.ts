import { buildMailto } from './mailto';

describe('buildMailto', () => {
  const url = buildMailto('eu@ex.dev', 'Contato pelo portfólio', {
    name: '  José & Cia ',
    email: 'jose@ex.com',
    message: 'Olá?\nTudo bem? 100% ok',
  });

  it('começa com mailto e destinatário', () => {
    expect(url.startsWith('mailto:eu@ex.dev?subject=')).toBe(true);
  });

  it('codifica &, ?, %, acentos e quebra de linha sem truncar', () => {
    const query = new URLSearchParams(url.slice(url.indexOf('?') + 1));
    expect(query.get('subject')).toBe('Contato pelo portfólio — José & Cia');
    expect(query.get('body')).toBe('Olá?\nTudo bem? 100% ok\n\nJosé & Cia <jose@ex.com>');
  });

  it('não deixa & cru que quebraria os parâmetros', () => {
    expect(url.split('&').length).toBe(2);
  });
});
