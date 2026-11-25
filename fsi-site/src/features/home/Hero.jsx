/**
 * @file Hero.jsx
 * @description トップページのメインビジュアル（ヒーロー）。
 * グラデーション + アニメーションで先進的な第一印象を与え、
 * CTAボタンで主要導線（事業内容・お問い合わせ）へ誘導する。
 * 文言は src/content/{ja,en}/home.js の hero。
 */
import { HashLink } from "react-router-hash-link";
import Link from "../../i18n/LocalizedLink";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import Lines from "../../components/ui/Lines";

export default function Hero() {
  const lang = useLang();
  const t = useContent().home.hero;

  return (
    <section className="hero-v2">
      {/* 背景の装飾レイヤー */}
      <div className="hero-v2-bg" aria-hidden="true">
        <span className="hero-orb hero-orb-1"></span>
        <span className="hero-orb hero-orb-2"></span>
        <span className="hero-grid"></span>
      </div>

      <div className="hero-v2-inner">
        <p className="hero-v2-eyebrow">{t.eyebrow}</p>
        <h1 className="hero-v2-title">
          {t.titleLine1}<br />
          <span className="hero-v2-accent">{t.titleAccent}</span>
        </h1>
        <p className="hero-v2-lead"><Lines text={t.lead} /></p>
        <div className="hero-v2-actions">
          <HashLink smooth to={localizePath("/#services", lang)} className="hero-v2-btn hero-v2-btn-primary">
            {t.primaryButton}
          </HashLink>
          <Link to="/contact" className="hero-v2-btn hero-v2-btn-ghost">
            {t.secondaryButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
