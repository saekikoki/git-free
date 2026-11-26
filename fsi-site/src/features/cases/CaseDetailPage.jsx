/**
 * CaseDetailPage.jsx - 導入事例の詳細（/cases/:slug/）
 *
 * 構成: ヒーロー（成果の数字）/ 概要の表 / 課題 / 取り組み / 成果 / お客様の声 / 関連する事業 / その他の事例 / お問い合わせ
 * 文言は src/content/{ja,en}/cases.js。
 */
import { useParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { articleJsonLd, breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import NotFoundPage from "../errors/NotFoundPage";
import CaseCard from "./CaseCard";

export default function CaseDetailPage() {
  const { slug } = useParams();
  const lang = useLang();
  const all = useContent();
  const t = all.cases;
  const c = t.items.find((item) => item.slug === slug);
  if (!c) return <NotFoundPage />;

  const L = t.labels;
  const path = localizePath(`/cases/${c.slug}`, lang);
  const service = all.services.items.find((s) => s.slug === c.service);
  const others = t.items.filter((item) => item.slug !== c.slug).slice(0, 3);

  return (
    <div className="corp case">
      <PageHead
        title={c.title}
        description={c.summary}
        type="article"
        jsonLd={[
          articleJsonLd({ headline: c.title, description: c.summary, path, lang }),
          breadcrumbJsonLd([
            { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
            { name: t.title, path: localizePath("/cases", lang) },
            { name: c.title, path },
          ]),
        ]}
      />

      <section className="newsx-hero case-hero" style={{ "--accent": c.color }}>
        <div className="corp-container case-hero-inner">
          <div>
            <p className="corp-hero-eyebrow">{t.eyebrow}</p>
            <span className="case-hero-industry">{c.industry}</span>
            <h1 className="newsx-detail-title">{c.title}</h1>
            <p className="newsx-hero-lead">{c.summary}</p>
          </div>
          <div className="case-hero-metric" aria-label={`${c.metric} ${c.metricValue}`}>
            <span className="case-hero-icon" aria-hidden="true">{c.icon}</span>
            <span className="case-hero-value">{c.metricValue}</span>
            <span className="case-hero-label">{c.metric}</span>
          </div>
        </div>
      </section>

      <Breadcrumb items={[{ name: t.title, to: "/cases" }, { name: c.title }]} />

      <section className="corp-section">
        <div className="corp-container svc-narrow">
          <dl className="corp-profile case-profile">
            <div className="corp-profile-row"><dt>{L.client}</dt><dd>{c.client}</dd></div>
            <div className="corp-profile-row"><dt>{L.industry}</dt><dd>{c.industry}</dd></div>
            <div className="corp-profile-row"><dt>{L.period}</dt><dd>{c.period}</dd></div>
            {service && (
              <div className="corp-profile-row">
                <dt>{L.service}</dt>
                <dd><Link to={`/services/${service.slug}`}>{service.title}</Link></dd>
              </div>
            )}
          </dl>

          <h2 className="case-h2">{L.challenge}</h2>
          {c.challenge.map((p) => <p key={p} className="svc-text">{p}</p>)}

          <h2 className="case-h2">{L.solution}</h2>
          {c.solution.map((p) => <p key={p} className="svc-text">{p}</p>)}

          <h2 className="case-h2">{L.results}</h2>
          <ul className="svc-checklist case-results">
            {c.results.map((r) => <li key={r}>{r}</li>)}
          </ul>

          {c.voice && (
            <figure className="case-voice">
              <blockquote>“{c.voice}”</blockquote>
              <figcaption>{L.voice} — {c.client}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head"><h2 className="corp-h2">{L.otherCases}</h2></div>
          <div className="case-grid">
            {others.map((o) => <CaseCard key={o.slug} item={o} more={t.more} />)}
          </div>
          <div className="news-more">
            <Link to="/cases" className="news-more-btn">{t.allCases}</Link>
          </div>
        </div>
      </section>

      <section className="recruit-cta">
        <div className="corp-container">
          <h2 className="recruit-cta-title">{L.ctaTitle}</h2>
          <p className="recruit-cta-text">{L.ctaText}</p>
          <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{L.ctaButton}</Link>
        </div>
      </section>
    </div>
  );
}
