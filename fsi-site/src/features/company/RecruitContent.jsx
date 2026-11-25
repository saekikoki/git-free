/**
 * RecruitContent.jsx - 採用情報ページ（上場企業級の採用サイト）
 *
 * 構成:
 *   1. ヒーロー（キャッチコピー）
 *   2. 数字で見る職場環境（画面に入るとカウントアップ）
 *   3. 求める人物像（Values）
 *   4. 募集職種（職種・採用区分で絞り込み）
 *   5. 社員インタビュー（「続きを読む」で全文を開く）
 *   6. 福利厚生・制度
 *   7. 選考フロー（各ステップの目安期間つき）
 *   8. エントリーCTA（廉価版は「よくある質問」への導線つき）
 *
 * 文言はすべて src/content/{ja,en}/recruit.js にある。
 */
import { useState } from "react";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Lines from "../../components/ui/Lines";
import CountUp from "../../components/ui/CountUp";
import useReveal from "../../components/ui/useReveal";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { FEATURES } from "@edition/config";

/** 絞り込みボタンの列（「すべて」+ 選択肢） */
function FilterGroup({ label, all, options, value, onChange }) {
  return (
    <div className="recruit-filter" role="group" aria-label={label}>
      <span className="recruit-filter-label">{label}</span>
      {["", ...options].map((opt) => (
        <button
          key={opt || "all"}
          type="button"
          className={`recruit-filter-btn ${value === opt ? "is-active" : ""}`}
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
        >
          {opt || all}
        </button>
      ))}
    </div>
  );
}

/** 社員インタビュー1人分のカード */
function InterviewCard({ item, t }) {
  const [open, setOpen] = useState(false);
  const bodyId = `interview-${item.name.replace(/\W/g, "")}-${item.initial}`;
  return (
    <article className={`recruit-interview ${open ? "is-open" : ""}`}>
      <div className="recruit-interview-head">
        <span className="recruit-interview-avatar" style={{ background: item.color }} aria-hidden="true">{item.initial}</span>
        <div>
          <p className="recruit-interview-name">{item.name}</p>
          <p className="recruit-interview-role">{item.role}</p>
        </div>
      </div>
      <blockquote className="recruit-interview-quote">“{item.quote}”</blockquote>
      <p id={bodyId} className="recruit-interview-body" hidden={!open}>{item.body}</p>
      <button
        type="button"
        className="recruit-interview-toggle"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(!open)}
      >
        {open ? t.close : t.more}
      </button>
    </article>
  );
}

export default function RecruitContent() {
  const lang = useLang();
  const all = useContent();
  const t = all.recruit;
  const [statRef, statVisible] = useReveal();
  const [valRef, valVisible] = useReveal();

  // 職種の絞り込み（"" は「すべて」）
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const jobs = t.jobs.items.filter(
    (job) => (!category || job.category === category) && (!type || job.types.includes(type))
  );

  // 言語を切り替えたら、絞り込みは「すべて」に戻す（選択肢の名前が言語ごとに違うため）
  const [filterLang, setFilterLang] = useState(lang);
  if (filterLang !== lang) {
    setFilterLang(lang);
    setCategory("");
    setType("");
  }

  return (
    <div className="corp recruit">
      <PageHead
        title={t.title}
        description={t.description}
        jsonLd={breadcrumbJsonLd([
          { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
          { name: t.title, path: localizePath("/recruit", lang) },
        ])}
      />

      {/* 1. ヒーロー */}
      <section className="recruit-hero">
        <div className="recruit-hero-bg" aria-hidden="true">
          <span className="hero-orb hero-orb-1"></span>
          <span className="hero-orb hero-orb-2"></span>
        </div>
        <div className="recruit-hero-inner">
          <p className="corp-hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="recruit-hero-title"><Lines text={t.hero.title} /></h1>
          <p className="recruit-hero-lead"><Lines text={t.hero.lead} /></p>
          <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{t.hero.button}</Link>
        </div>
      </section>

      {/* パンくず */}
      <nav className="corp-breadcrumb" aria-label={all.common.breadcrumbLabel}>
        <div className="corp-container">
          <Link to="/">{all.common.breadcrumbTop}</Link>
          <span className="corp-sep">/</span>
          <span>{t.title}</span>
        </div>
      </nav>

      {/* 2. 数字で見る職場環境 */}
      <section className="corp-stats-section">
        <div className="corp-container">
          <div className="corp-section-head corp-section-head--light">
            <p className="corp-eyebrow">{t.stats.eyebrow}</p>
            <h2 className="corp-h2">{t.stats.title}</h2>
          </div>
          <div ref={statRef} className={`corp-stats ${statVisible ? "is-visible" : ""}`}>
            {t.stats.items.map((s) => (
              <div key={s.label} className="corp-stat">
                <div className="corp-stat-value"><CountUp value={s.value} /><span className="corp-stat-suffix">{s.suffix}</span></div>
                <div className="corp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 求める人物像 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.values.eyebrow}</p>
            <h2 className="corp-h2">{t.values.title}</h2>
          </div>
          <div ref={valRef} className={`corp-philosophy ${valVisible ? "is-visible" : ""}`}>
            {t.values.items.map((v, i) => (
              <div key={v.title} className="corp-phil-card" style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="corp-phil-icon" aria-hidden="true">{v.icon}</span>
                <h3 className="corp-phil-title">{v.title}</h3>
                <p className="corp-phil-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 募集職種 */}
      <section className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.jobs.eyebrow}</p>
            <h2 className="corp-h2">{t.jobs.title}</h2>
          </div>

          <div className="recruit-filters">
            <FilterGroup
              label={t.jobs.filters.categoryLabel}
              all={t.jobs.filters.all}
              options={t.jobs.filters.categories}
              value={category}
              onChange={setCategory}
            />
            <FilterGroup
              label={t.jobs.filters.typeLabel}
              all={t.jobs.filters.all}
              options={t.jobs.filters.types}
              value={type}
              onChange={setType}
            />
          </div>
          <p className="recruit-job-count" aria-live="polite">{jobs.length} {t.jobs.countSuffix}</p>

          {jobs.length === 0 ? (
            <p className="newsx-empty">{t.jobs.noMatch}</p>
          ) : (
            <div className="recruit-jobs">
              {jobs.map((job) => (
                <article key={job.title} className="recruit-job-card">
                  <span className="recruit-job-cat">{job.category}</span>
                  <h3 className="recruit-job-title">{job.title}</h3>
                  <p className="recruit-job-desc">{job.desc}</p>
                  <div className="recruit-job-footer">
                    <span className="recruit-job-type">{job.types.join(" / ")}</span>
                    <Link to="/contact" className="recruit-job-link">{t.jobs.apply}</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. 社員インタビュー */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.interviews.eyebrow}</p>
            <h2 className="corp-h2">{t.interviews.title}</h2>
            <p className="corp-section-sub">{t.interviews.sub}</p>
          </div>
          <div className="recruit-interviews">
            {t.interviews.items.map((item) => (
              <InterviewCard key={item.name} item={item} t={t.interviews} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. 福利厚生 */}
      <section className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.benefits.eyebrow}</p>
            <h2 className="corp-h2">{t.benefits.title}</h2>
          </div>
          <div className="recruit-benefits">
            {t.benefits.items.map((b) => (
              <div key={b.title} className="recruit-benefit">
                <span className="recruit-benefit-icon" aria-hidden="true">{b.icon}</span>
                <span className="recruit-benefit-title">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 選考フロー */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head">
            <p className="corp-eyebrow">{t.flow.eyebrow}</p>
            <h2 className="corp-h2">{t.flow.title}</h2>
            <p className="corp-section-sub">{t.flow.note}</p>
          </div>
          <ol className="recruit-flow">
            {t.flow.items.map((f) => (
              <li key={f.step} className="recruit-flow-item">
                <div className="recruit-flow-step">{f.step}</div>
                <h3 className="recruit-flow-title">{f.title}</h3>
                <p className="recruit-flow-desc">{f.desc}</p>
                <span className="recruit-flow-duration">{f.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. エントリーCTA */}
      <section className="recruit-cta">
        <div className="corp-container">
          <h2 className="recruit-cta-title">{t.cta.title}</h2>
          <p className="recruit-cta-text">{t.cta.text}{FEATURES.faq && t.cta.faqText}</p>
          <div className="recruit-cta-actions">
            <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{t.cta.button}</Link>
            {FEATURES.faq && (
              <Link to="/faq" className="hero-v2-btn hero-v2-btn-ghost">{t.cta.faq}</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
