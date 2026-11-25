/**
 * CompanyOverview.jsx - 企業情報ページ（上場企業級のコーポレートページ）
 *
 * 構成:
 *   1. ヒーロー（グラデーション背景 + キャッチコピー）
 *   2. 企業理念（Mission / Vision / Values）
 *   3. 数値で見るハイライト（KPI。画面に入るとカウントアップ）
 *   4. 会社概要テーブル
 *   5. 役員一覧
 *   6. 沿革タイムライン
 *   7. アクセス（住所・最寄り駅・地図）
 *
 * 文言はすべて src/content/{ja,en}/company.js にある。
 */
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Lines from "../../components/ui/Lines";
import CountUp from "../../components/ui/CountUp";
import useReveal from "../../components/ui/useReveal";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import AccessMap from "./AccessMap";

export default function CompanyOverview() {
  const lang = useLang();
  const all = useContent();
  const t = all.company;
  const [philRef, philVisible] = useReveal();
  const [statRef, statVisible] = useReveal();

  return (
    <div className="corp">
      <PageHead
        title={t.title}
        description={t.description}
        jsonLd={breadcrumbJsonLd([
          { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
          { name: t.title, path: localizePath("/company", lang) },
        ])}
      />

      {/* 1. ヒーロー */}
      <section className="corp-hero">
        <div className="corp-hero-inner">
          <p className="corp-hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="corp-hero-title">{t.hero.title}</h1>
          <p className="corp-hero-lead"><Lines text={t.hero.lead} /></p>
        </div>
        <div className="corp-hero-scroll" aria-hidden="true"><span></span></div>
      </section>

      {/* パンくず */}
      <nav className="corp-breadcrumb" aria-label={all.common.breadcrumbLabel}>
        <div className="corp-container">
          <Link to="/">{all.common.breadcrumbTop}</Link>
          <span className="corp-sep">/</span>
          <span>{t.title}</span>
        </div>
      </nav>

      {/* 2. 企業理念 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.philosophy.eyebrow}</p>
            <h2 className="corp-h2">{t.philosophy.title}</h2>
          </div>
          <div ref={philRef} className={`corp-philosophy ${philVisible ? "is-visible" : ""}`}>
            {t.philosophy.items.map((p, i) => (
              <div key={p.title} className="corp-phil-card" style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="corp-phil-icon" aria-hidden="true">{p.icon}</span>
                <h3 className="corp-phil-title">{p.title}</h3>
                <p className="corp-phil-sub">{p.subtitle}</p>
                <p className="corp-phil-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 数値ハイライト */}
      <section className="corp-stats-section">
        <div className="corp-container">
          <div className="corp-section-head corp-section-head--light">
            <p className="corp-eyebrow">{t.highlights.eyebrow}</p>
            <h2 className="corp-h2">{t.highlights.title}</h2>
          </div>
          <div ref={statRef} className={`corp-stats ${statVisible ? "is-visible" : ""}`}>
            {t.highlights.items.map((h) => (
              <div key={h.label} className="corp-stat">
                <div className="corp-stat-value">
                  <CountUp value={h.value} plain={h.plain} /><span className="corp-stat-suffix">{h.suffix}</span>
                </div>
                <div className="corp-stat-label">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 会社概要 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.profile.eyebrow}</p>
            <h2 className="corp-h2">{t.profile.title}</h2>
          </div>
          <dl className="corp-profile">
            {t.profile.rows.map((row) => (
              <div key={row.label} className="corp-profile-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. 役員一覧 */}
      <section className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.executives.eyebrow}</p>
            <h2 className="corp-h2">{t.executives.title}</h2>
          </div>
          <div className="corp-executives">
            {t.executives.items.map((ex) => (
              <div key={ex.name} className="corp-exec-card">
                <div className="corp-exec-avatar" aria-hidden="true">{ex.initial}</div>
                <div className="corp-exec-name">{ex.name}</div>
                <div className="corp-exec-role">{ex.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 沿革 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.history.eyebrow}</p>
            <h2 className="corp-h2">{t.history.title}</h2>
          </div>
          <ol className="corp-timeline">
            {t.history.items.map((h) => (
              <li key={h.year} className="corp-timeline-item">
                <div className="corp-timeline-year">{h.year}</div>
                <div className="corp-timeline-dot" aria-hidden="true"></div>
                <div className="corp-timeline-event">{h.event}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. アクセス */}
      <section id="access" className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.access.eyebrow}</p>
            <h2 className="corp-h2">{t.access.title}</h2>
          </div>
          <AccessMap t={t.access} />
        </div>
      </section>
    </div>
  );
}
