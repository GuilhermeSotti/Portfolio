import Link from "next/link";
import Image from "next/image";
import { useLocale } from "../components/LocaleContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("site_theme") : null;
    setIsLight(stored === "light");
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    try {
      if (next) {
        document.documentElement.classList.add("light");
        localStorage.setItem("site_theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        localStorage.setItem("site_theme", "dark");
      }
    } catch {}
  };

  return (
    <header className="container navbar py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" aria-label={t("nav.home")}>
          <div className="flex items-center gap-3">
            <Image src="/avatar.jpg" alt="avatar" width={36} height={36} className="rounded-full" />
            <span className="font-semibold">{t("hero.title")}</span>
          </div>
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link href="#projects"className="nav-link text-sm">{t("nav.projects")}</Link>

        {/* language switch */}
        <div className="lang-switch" role="tablist" aria-label="Language switch">
          <button
            aria-pressed={locale === "pt"}
            className={`lang-btn ${locale === "pt" ? "active" : ""}`}
            onClick={() => setLocale("pt")}
            title="Português"
          >
            PT
          </button>
          <button
            aria-pressed={locale === "en"}
            className={`lang-btn ${locale === "en" ? "active" : ""}`}
            onClick={() => setLocale("en")}
            title="English"
          >
            EN
          </button>
        </div>

        {/* theme toggle */}
        <button aria-label="Toggle theme" className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {isLight ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v1M12 20v1M4.2 4.2l.7.7M18.1 18.1l.7.7M1 12h1M22 12h1M4.2 19.8l.7-.7M18.1 5.9l.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
}
