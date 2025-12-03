import React, { createContext, useContext } from 'react';

type TContext = {
  locale: 'en' | 'pt';
  translations: Record<string, any>;
};

const TranslationContext = createContext<TContext | null>(null);

export const TranslationProvider = ({ locale, translations, children }: React.PropsWithChildren<TContext & { children: React.ReactNode }>) => {
  return <TranslationContext.Provider value={{ locale, translations }}>{children}</TranslationContext.Provider>;
};

export function useTranslations() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslations must be used inside TranslationProvider');
  return ctx;
}
