import React, { createContext, useContext, useEffect, useState } from "react";
import en from "../i18n/en.json";
import pt from "../i18n/pt.json";

type LocaleKey = "pt" | "en";
type LocaleContextType = {
  locale: LocaleKey;
  setLocale: (l: LocaleKey) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const translations = { en, pt };

const LocaleContext = createContext<LocaleContextType>({
  locale: "pt",
  setLocale: () => {},
  t: (k) => k
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleKey>("pt");

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("site_locale") : null;
      if (stored === "en" || stored === "pt") setLocaleState(stored);
      else {
        // default: detect browser
        const nav = typeof navigator !== "undefined" ? navigator.language : "pt";
        if (nav.startsWith("en")) setLocaleState("en");
        else setLocaleState("pt");
      }
    } catch {
      setLocaleState("pt");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("site_locale", locale);
    } catch {}
  }, [locale]);

  const setLocale = (l: LocaleKey) => setLocaleState(l);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".");
    let cur: any = translations[locale];
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return key;
    }
    if (typeof cur === "string") {
      if (!vars) return cur;
      return Object.entries(vars).reduce((acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, "g"), String(v)), cur);
    }
    return key;
  };

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
