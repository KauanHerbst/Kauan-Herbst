import { Injectable, Signal, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Translation,
  TranslocoLoader,
  TranslocoService,
  provideTransloco,
  translateObjectSignal,
} from '@jsverse/transloco';
import { firstValueFrom, of } from 'rxjs';
import en from './en.json';
import pt from './pt.json';

export type Copy = typeof pt;
export const LANGUAGES = [
  { id: 'pt', label: 'Português', htmlLang: 'pt-BR', flag: 'br' },
  { id: 'en', label: 'English', htmlLang: 'en', flag: 'us' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['id'];
export type FlagCode = (typeof LANGUAGES)[number]['flag'];

const LANG_IDS: readonly string[] = LANGUAGES.map((language) => language.id);

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && LANG_IDS.includes(value);
}

const TRANSLATIONS: Record<Lang, Copy> = { pt, en };
const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
class StaticLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return of(TRANSLATIONS[lang as Lang] as unknown as Translation);
  }
}

export function storedLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : 'pt';
  } catch {
    return 'pt';
  }
}

export function provideI18n(lang: Lang = storedLang()) {
  return [
    provideTransloco({
      config: {
        availableLangs: [...LANG_IDS],
        defaultLang: lang,
        fallbackLang: 'pt',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: StaticLoader,
    }),

    provideAppInitializer(() => firstValueFrom(inject(TranslocoService).load(lang))),
  ];
}

export function copy<K extends keyof Copy>(key: K): Signal<Copy[K]> {
  return translateObjectSignal(key) as unknown as Signal<Copy[K]>;
}

@Injectable({ providedIn: 'root' })
export class LangState {
  private readonly transloco = inject(TranslocoService);
  readonly current = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  }) as Signal<Lang>;

  set(lang: Lang): void {
    this.transloco.setActiveLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }
}
