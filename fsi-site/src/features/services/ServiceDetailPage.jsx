/**
 * ServiceDetailPage.jsx - 事業内容の詳細（/services/:slug/）
 *
 * 構成: ヒーロー / 概要 / こんな課題はありませんか / 提供内容 / 進め方 / 関連する導入事例 / よくあるご質問 / その他の事業 / お問い合わせ
 * 文言は src/content/{ja,en}/services.js（関連事例は cases.js）。
 * 検索エンジン向けに、サービス・パンくず・FAQ の構造化データを出力する。
 */
import { useParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { breadcrumbJsonLd, serviceJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import NotFoundPage from "../errors/NotFoundPage";
import CaseCard from "../cases/CaseCard";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const lang = useLang();
  const all = useContent();
  const t = all.services;
  const s = t.items.find((item) => item.slug === slug);
  if (!s) return <NotFoundPage />;

  const L = t.labels;
  const path = localizePath(`/services/${s.slug}`, lang);
  const cases = s.relatedCases.map((cs) => all.cases.items.find((c) => c.slug === cs)).filter(Boolean);
  const others = t.items.filter((item) => item.slug !== s.slug);

  const faqJsonLd = s.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: s.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="corp svc">
      <PageHead
        title={s.title}
        description={s.summary}
        jsonLd={[
          serviceJsonLd({ name: s.title, description: s.lead, path, serviceType: s.tags.join(", ") }),
          breadcrumbJsonLd([
            { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
            { name: t.title, path: localizePath("/services", lang) },
            { name: s.title, path },
          ]),
          faqJsonLd,
        ]}
      />

      <section className="newsx-hero svc-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="newsx-hero-title"><span aria-hidden="true">{s.icon}</span> {s.title}</h1>
          <p className="newsx-hero-lead svc-hero-lead">{s.lead}</p>
        </div>
      </section>

      <Breadcrumb items={[{ name: t.title, to: "/services" }, { name: s.title }]} />

      {/* 概要 */}
      <section className="corp-section">
        <div className="corp-container svc-narrow">
          {s.description.map((p) => (
            <p key={p} className="svc-text">{p}</p>
          ))}
        </div>
      </section>

      {/* こんな課題はありませんか */}
      <section className="corp-section corp-section--gray">
        <div className="corp-container svc-narrow">
          <div className="corp-section-head"><h2 className="corp-h2">{L.challenges}</h2></div>
          <ul className="svc-checklist">
            {s.challenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 提供内容 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head"><h2 className="corp-h2">{L.features}</h2></div>
          <div className="svc-features">
            {s.features.map((f, i) => (
              <div key={f.title} className="svc-feature">
                <span className="svc-feature-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="svc-feature-title">{f.title}</h3>
                <p className="svc-feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 進め方 */}
      <section className="corp-section corp-section--gray">
        <div className="corp-container">
          <div className="corp-section-head"><h2 className="corp-h2">{L.process}</h2></div>
          <ol className="svc-process">
            {s.process.map((p, i) => (
              <li key={p.title} className="svc-process-step">
                <span className="svc-process-num">{i + 1}</span>
                <h3 className="svc-process-title">{p.title}</h3>
                <p className="svc-process-text">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 関連する導入事例 */}
      {cases.length > 0 && (
        <section className="corp-section">
          <div className="corp-container">
            <div className="corp-section-head"><h2 className="corp-h2">{L.relatedCases}</h2></div>
            <div className="case-grid">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} more={all.cases.more} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* よくあるご質問 */}
      {s.faq.length > 0 && (
        <section className="corp-section corp-section--gray">
          <div className="corp-container svc-narrow">
            <div className="corp-section-head"><h2 className="corp-h2">{L.faq}</h2></div>
            <div className="faq-list">
              {s.faq.map((f) => (
                <details key={f.q} className="faq-item">
                  <summary className="faq-q">
                    <span className="faq-mark" aria-hidden="true">Q</span>
                    <span className="faq-q-text">{f.q}</span>
                    <span />
                  </summary>
                  <div className="faq-a">
                    <span className="faq-mark faq-mark-a" aria-hidden="true">A</span>
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* その他の事業 */}
      <section className="corp-section">
        <div className="corp-container">
          <div className="corp-section-head"><h2 className="corp-h2">{L.otherServices}</h2></div>
          <div className="svc-others">
            {others.map((o) => (
              <Link key={o.slug} to={`/services/${o.slug}`} className="svc-other">
                <span className="svc-other-icon" aria-hidden="true">{o.icon}</span>
                <span className="svc-other-title">{o.title}</span>
                <span className="svc-other-text">{o.summary}</span>
              </Link>
            ))}
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
