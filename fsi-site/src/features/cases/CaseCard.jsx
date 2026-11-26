/**
 * CaseCard.jsx - 導入事例1件分のカード（一覧・事業内容の詳細・事例の詳細で共通）
 */
import Link from "../../i18n/LocalizedLink";

export default function CaseCard({ item, more }) {
  return (
    <article className="case-card" style={{ "--accent": item.color }}>
      <div className="case-card-visual" aria-hidden="true">
        <span className="case-card-icon">{item.icon}</span>
        <span className="case-card-metric">{item.metricValue}</span>
        <span className="case-card-metric-label">{item.metric}</span>
      </div>
      <div className="case-card-body">
        <span className="case-card-industry">{item.industry}</span>
        <h3 className="case-card-title">
          <Link to={`/cases/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className="case-card-summary">{item.summary}</p>
        <span className="case-card-more" aria-hidden="true">{more} →</span>
      </div>
    </article>
  );
}
