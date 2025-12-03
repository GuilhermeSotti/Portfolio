// Simple client-side i18n utility with fallback and interpolation
import en from '../locales/en.json';
import pt from '../locales/pt.json';

export type Locale = 'en' | 'pt';
const LOCALE_KEY = 'locale_preference';
const DEFAULT: Locale = 'en';

const LOCALES: Record<Locale, Record<string, any>> = {
  en,
  pt
};

/**
 * Flatten nested JSON into dot keys (e.g. 'hero.greeting' => 'Hi...')
 * returns a map for quick lookup.
 */
function flatten(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof val === 'string') out[key] = val;
    else if (typeof val === 'object' && val !== null) Object.assign(out, flatten(val, key));
  }
  return out;
}

const flatCache: Record<Locale, Record<string, string>> = {
  en: flatten(LOCALES.en),
  pt: flatten(LOCALES.pt)
};

/**
 * interpolate string like 'Hello {name}' with params object
 */
function interpolate(template: string, params?: Record<string, any>) {
  if (!params) return template;
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const val = params[key.trim()];
    return val === undefined || val === null ? '' : String(val);
  });
}

/**
 * Get current locale (reads localStorage or DEFAULT)
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT;
  const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (stored && (stored === 'en' || stored === 'pt')) return stored;
  return DEFAULT;
}

/**
 * Set locale (persist and update document language)
 */
export function setLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_KEY, locale);
  document.documentElement.setAttribute('lang', locale === 'en' ? 'en' : 'pt-BR');
}

/**
 * Translate function: t(key, params?, locale?)
 * - tries requested locale (or current), falls back to en if missing.
 */
export function t(key: string, params?: Record<string, any>, locale?: Locale): string {
  const useLocale: Locale = locale ?? getLocale();
  const primary = flatCache[useLocale] ?? {};
  const fallback = flatCache['en'];
  const value = primary[key] ?? fallback[key];
  if (!value) {
    // final fallback: return the key so missing translations are visible
    return key;
  }
  return interpolate(value, params);
}

/**
 * List available locales
 */
export const supportedLocales: Locale[] = ['en', 'pt'];
