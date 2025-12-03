import en from '../locales/en.json';
import pt from '../locales/pt.json';

export type Locale = 'en' | 'pt';

const LOCALES: Record<Locale, Record<string, any>> = {
  en,
  pt
};

export function loadTranslations(locale: Locale) {
  return LOCALES[locale] ?? LOCALES['en'];
}

/**
 * shallow-get by dot-path 'topic.title' with fallback to key
 */
export function t(translations: Record<string, any>, key: string, params?: Record<string, any>) {
  const parts = key.split('.');
  let cur: any = translations;
  for (const p of parts) {
    if (!cur) break;
    cur = cur[p];
  }
  let text = typeof cur === 'string' ? cur : key;
  if (params) {
    text = text.replace(/\{([^}]+)\}/g, (_, name) => {
      return params[name.trim()] ?? '';
    });
  }
  return text;
}
