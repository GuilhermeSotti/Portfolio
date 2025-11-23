import { useLocale } from "../components/LocaleContext";

export default function Hero() {
  const { t } = useLocale();
  return (
    <section className="hero container">
      <div className="left">
        <h1 className="fade-up">{t("hero.title")}</h1>
        <p className="lead">{t("hero.subtitle")}</p>
        <div className="mt-6">
          <a href="#projects" className="btn btn-primary">{t("hero.cta")}</a>
        </div>
      </div>

      <div>
        <div className="avatar">
          <img src="/avatar.svg" alt="avatar" width={120} height={120} />
        </div>
      </div>
    </section>
  );
}
