/**
 * NewsCard.jsx - ニュース1件分のカード（トップ・一覧・関連記事で共通）
 */
import Link from "../../i18n/LocalizedLink";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { categoryLabel, formatNewsDate, localizeNews } from "./newsUtils";

export default function NewsCard({ item }) {
  const lang = useLang();
  const t = useContent();
  const n = localizeNews(item, lang);
  const d = formatNewsDate(n.publishedAt, lang);

  return (
    <Link to={`/news/${n.SK}`} className="newsx-card">
      <div className="newsx-card-date">
        <span className="newsx-card-year">{d.year}</span>
        <span className="newsx-card-md">{d.md}</span>
      </div>
      <div className="newsx-card-body">
        {n.category && (
          <span className={`newsx-badge newsx-badge--${n.category}`}>{categoryLabel(n.category, t)}</span>
        )}
        <span className="newsx-card-title">{n.title}</span>
        {n.summary && <span className="newsx-card-summary">{n.summary}</span>}
      </div>
      <span className="newsx-card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
