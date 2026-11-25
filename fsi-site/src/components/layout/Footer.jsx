/**
 * @file Footer.jsx
 * @description サイト共通のフッター。
 * ナビゲーション、SNSリンク、規約リンク、著作権を表示する。
 * リンク列はエディションごとの config.js（footerNav）で定義する。
 * 英語ページでは headingEn / labelEn（なければ日本語）を表示する。
 */
import Link from "../../i18n/LocalizedLink";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import Lines from "../ui/Lines";
import { footerNav, FEATURES } from "@edition/config";

export default function Footer() {
  const lang = useLang();
  const t = useContent().common.footer;
  const pick = (ja, en) => (lang === "en" && en) || ja;

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* ブランド列 */}
          <div className="footer-brand">
            <h2 className="footer-logo">FSI-STYLE <span>CORP</span></h2>
            <p className="footer-tagline"><Lines text={t.tagline} /></p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="footer-social-icon">f</a>
              <a href="#" aria-label="X (Twitter)" className="footer-social-icon">X</a>
              <a href="#" aria-label="LinkedIn" className="footer-social-icon">in</a>
              {FEATURES.rss && (
                <a
                  href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}
                  aria-label="RSS"
                  className="footer-social-icon footer-social-rss"
                >
                  {t.rss}
                </a>
              )}
            </div>
          </div>

          {/* ナビゲーション列 */}
          {footerNav.map((col) => (
            <nav key={col.heading} className="footer-col">
              <h3>{pick(col.heading, col.headingEn)}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link.to}><Link to={link.to}>{pick(link.label, link.labelEn)}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* 下段 */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-legal">
            <Link to="/privacy">{t.privacy}</Link>
            <Link to="/terms">{t.terms}</Link>
            <Link to="/sitemap">{t.sitemap}</Link>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} FSI-STYLE CORP. {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
