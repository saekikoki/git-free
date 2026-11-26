/**
 * CasesPage.jsx - 導入事例の一覧（/cases/）
 *
 * 業界で絞り込める。文言は src/content/{ja,en}/cases.js。
 */
import { useState } from "react";
import PageHead from "../../components/layout/PageHead";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import CaseCard from "./CaseCard";

export default function CasesPage() {
  const lang = useLang();
  const all = useContent();
  const t = all.cases;
  const [industry, setIndustry] = useState("");

  // 言語を切り替えたら絞り込みを解除する（業界名が言語ごとに違うため）
  const [filterLang, setFilterLang] = useState(lang);
  if (filterLang !== lang) {
    setFilterLang(lang);
    setIndustry("");
  }

  const industries = [...new Set(t.items.map((c) => c.industry))];
  const shown = t.items.filter((c) => !industry || c.industry === industry);

  return (
    <div className="corp cases">
      <PageHead
        title={t.title}
        description={t.description}
        jsonLd={breadcrumbJsonLd([
          { name: all.common.breadcrumbTop, path: localizePath("/", lang) },
          { name: t.title, path: localizePath("/cases", lang) },
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
          <div className="newsx-tabs case-filter" role="group" aria-label={t.industryLabel}>
            {["", ...industries].map((ind) => (
              <button
                key={ind || "all"}
                type="button"
                className={`newsx-tab ${industry === ind ? "is-active" : ""}`}
                aria-pressed={industry === ind}
                onClick={() => setIndustry(ind)}
              >
                {ind || t.all}
              </button>
            ))}
          </div>

          <div className="case-grid">
            {shown.map((c) => (
              <CaseCard key={c.slug} item={c} more={t.more} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
