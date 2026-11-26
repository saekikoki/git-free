/**
 * @file Footer.jsx
 * @description サイト共通のフッター。
 * ナビゲーション、SNSリンク、規約リンク、著作権を表示する。
 * リンク列はエディションごとの config.js（footerNav）で定義する。
 * 英語ページでは headingEn / labelEn（なければ日本語）を表示する。
 * ロゴ・社名・SNS の URL は src/content/company-profile.js から取る（SNS は URL があるものだけ表示）。
 */
import Link from "../../i18n/LocalizedLink";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import profile from "../../content/company-profile";
import Lines from "../ui/Lines";
import { footerNav, FEATURES } from "@edition/config";

// SNS の表示名と、アイコンの代わりに出す文字
const SNS = [
  { key: "facebook", label: "Facebook", mark: "f" },
  { key: "x", label: "X (Twitter)", mark: "X" },
  { key: "linkedin", label: "LinkedIn", mark: "in" },
  { key: "youtube", label: "YouTube", mark: "▶" },
];

export default function Footer() {
  const lang = useLang();
  const t = useContent().common.footer;
  const pick = (ja, en) => (lang === "en" && en) || ja;
  const sns = SNS.filter((s) => profile.sns[s.key]);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container" style={{ "--footer-cols": footerNav.length }}>
          {/* ブランド列 */}
          <div className="footer-brand">
            <p className="footer-logo">{profile.brand.main} <span>{profile.brand.accent}</span></p>
            <p className="footer-tagline"><Lines text={t.tagline} /></p>
            {(sns.length > 0 || FEATURES.rss) && (
              <div className="footer-social">
                {sns.map((s) => (
                  <a
                    key={s.key}
                    href={profile.sns[s.key]}
                    aria-label={s.label}
                    className="footer-social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.mark}
                  </a>
                ))}
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
            )}
          </div>

          {/* ナビゲーション列 */}
          {footerNav.map((col) => (
            <nav key={col.heading} className="footer-col" aria-label={pick(col.heading, col.headingEn)}>
              <p className="footer-col-title">{pick(col.heading, col.headingEn)}</p>
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
          <p className="footer-copyright">
            © {new Date().getFullYear()} {profile.legalName[lang] || profile.legalName.ja}. {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
