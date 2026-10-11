import { PROFILE, TECH_LOGOS } from './content';
import en from '../i18n/en.json';
import pt from '../i18n/pt.json';

describe('content', () => {
  for (const [lang, copy] of [
    ['pt', pt],
    ['en', en],
  ] as const) {
    it(`${lang}: toda tecnologia com logo tem uma descrição de uso (sem travessão)`, () => {
      const usage = copy.skills.usage as Record<string, string>;
      for (const name of Object.keys(TECH_LOGOS)) {
        expect(usage[name], name).toBeTruthy();
        expect(usage[name], name).not.toContain('—');
      }
    });

    it(`${lang}: toda rede social tem uma frase para o hover card`, () => {
      for (const s of PROFILE.social) expect(copy.profile.hints[s.label], s.label).toBeTruthy();
    });
  }
});
