/**
 * FaqPage.jsx - よくある質問（/faq、英語: /en/faq）
 *
 * 機能:
 *   - カテゴリで絞り込み
 *   - キーワードで質問・回答を検索
 *   - 質問をクリックすると回答が開く（<details> を使うので JavaScript がなくても開閉できる）
 *   - 検索エンジン向けの FAQ 構造化データ（検索結果に質問と回答が表示されることがある）
 *
 * 文言は src/content/{ja,en}/faq.js。
 */
import { useEffect, useMemo, useState } from "react";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import Lines from "../../components/ui/Lines";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";

export default function FaqPage() {
  const lang = useLang();
  const all = useContent();
  const t = all.faq;
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  // 言語が変わったら絞り込みを解除する（カテゴリ名が言語ごとに違うため）
  const [filterLang, setFilterLang] = useState(lang);
  if (filterLang !== lang) {
    setFilterLang(lang);
    setCategory("");
    setQuery("");
  }

  // 印刷するときは、閉じている質問もすべて開いて回答まで印刷する
  useEffect(() => {
    const openAll = () => document.querySelectorAll(".faq-item").forEach((d) => { d.open = true; });
    window.addEventListener("beforeprint", openAll);
    return () => window.removeEventListener("beforeprint", openAll);
  }, []);

  const items = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return t.items.filter((item) => {
      if (category && item.category !== category) return false;
      const text = `${item.q} ${item.a}`.toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [t.items, category, query]);

  // 検索エンジン向けの FAQ 構造化データ（絞り込みに関係なく全件）
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a.replace(/\n/g, " ") },
    })),
  };

  return (
    <div className="corp faq">
      <PageHead
        title={t.title}
        description={t.description}
        jsonLd={[
          faqJsonLd,
          breadcrumbJsonLd([
            { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
            { name: t.title, path: localizePath("/faq", lang) },
          ]),
        ]}
      />

      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="newsx-hero-title">{t.title}</h1>
          <p className="newsx-hero-lead">{t.lead}</p>
        </div>
      </section>

      <nav className="corp-breadcrumb" aria-label={all.common.breadcrumbLabel}>
        <div className="corp-container">
          <Link to="/">{all.common.breadcrumbTop}</Link>
          <span className="corp-sep">/</span>
          <span>{t.title}</span>
        </div>
      </nav>

      <section className="corp-section">
        <div className="corp-container faq-wrap">
          <div className="newsx-toolbar">
            <div className="newsx-tabs" role="group" aria-label={t.title}>
              {["", ...t.categories].map((cat) => (
                <button
                  key={cat || "all"}
                  type="button"
                  className={`newsx-tab ${category === cat ? "is-active" : ""}`}
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat || t.all}
                </button>
              ))}
            </div>
            <div className="newsx-search">
              <input
                type="search"
                className="newsx-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchLabel}
              />
            </div>
          </div>

          {items.length === 0 ? (
            <p className="newsx-empty">{t.noMatch}</p>
          ) : (
            <div className="faq-list">
              {items.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary className="faq-q">
                    <span className="faq-mark" aria-hidden="true">Q</span>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-cat">{item.category}</span>
                  </summary>
                  <div className="faq-a">
                    <span className="faq-mark faq-mark-a" aria-hidden="true">A</span>
                    <p><Lines text={item.a} /></p>
                  </div>
                </details>
              ))}
            </div>
          )}

          <div className="faq-contact">
            <p>{t.contactLead}</p>
            <Link to="/contact" className="hero-v2-btn hero-v2-btn-primary">{t.contactButton}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
