import { useEffect, useState, useCallback } from 'react';
import { getLocale, setLocale, t as translate, Locale, supportedLocales } from '../i18n';

export function useTranslate() {
  const [locale, setLocaleState] = useState<Locale>(() => getLocale());

  useEffect(() => {
    // ensure document lang is in sync
    try {
      document.documentElement.setAttribute('lang', locale === 'en' ? 'en' : 'pt-BR');
    } catch (e) {
      // ignore SSR
    }
  }, [locale]);

  const setLocalePersistent = useCallback((next: Locale) => {
    setLocale(next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      return translate(key, params, locale);
    },
    [locale]
  );

  return {
    locale,
    setLocale: setLocalePersistent,
    t,
    supportedLocales
  };
}
