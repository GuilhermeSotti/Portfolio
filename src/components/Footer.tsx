import { useLocale } from "../components/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer container">
      <div className="flex items-center justify-between">
        <div className="footer-brand">{t("hero.title")}</div>
        <div className="footer-links text-sm">
          <span dangerouslySetInnerHTML={{ __html: t("footer.copyright", { year }) }} />
        </div>
      </div>
    </footer>
  );
}
