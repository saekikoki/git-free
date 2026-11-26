/**
 * ServicesPage.jsx - 事業内容の一覧（/services/）
 *
 * 文言は src/content/{ja,en}/services.js。
 */
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";

export default function ServicesPage() {
  const lang = useLang();
  const all = useContent();
  const t = all.services;

  return (
    <div className="corp svc">
      <PageHead
        title={t.title}
        description={t.description}
        jsonLd={breadcrumbJsonLd([
          { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
          { name: t.title, path: localizePath("/services", lang) },
        ])}
      />

      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="newsx-hero-title">{t.title}</h1>
          <p className="newsx-hero-lead">{t.lead}</p>
        </div>
      </section>

      <Breadcrumb items={[{ name: t.title }]} />

      <section className="corp-section">
        <div className="corp-container">
          <div className="svc-list">
            {t.items.map((s) => (
              <article key={s.slug} className="svc-list-card">
                <div className="svc-list-icon" aria-hidden="true">{s.icon}</div>
                <div className="svc-list-body">
                  <h2 className="svc-list-title">
                    <Link to={`/services/${s.slug}`}>{s.title}</Link>
                  </h2>
                  <p className="svc-list-lead">{s.lead}</p>
                  <ul className="service-v2-tags" aria-label={s.title}>
                    {s.tags.map((tag) => (
                      <li key={tag} className="service-v2-tag">{tag}</li>
                    ))}
                  </ul>
                </div>
                <Link to={`/services/${s.slug}`} className="svc-list-more" aria-hidden="true" tabIndex={-1}>
                  {t.more} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="recruit-cta">
        <div className="corp-container">
          <h2 className="recruit-cta-title">{t.labels.ctaTitle}</h2>
          <p className="recruit-cta-text">{t.labels.ctaText}</p>
          <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{t.labels.ctaButton}</Link>
        </div>
      </section>
    </div>
  );
}
