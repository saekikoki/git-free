/**
 * NewsCard.jsx - ニュース・コラム1件分のカード（トップ・一覧・関連記事で共通）
 *
 * 英語ページで英語版のない記事は、日本語のページへリンクし「Japanese」の目印を付ける。
 */
import { Link } from "react-router-dom";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { categoryLabel, formatNewsDate, localizeNews, newsPath, newsTexts } from "./newsUtils";

export default function NewsCard({ item, kind = "news" }) {
  const lang = useLang();
  const t = useContent();
  const tn = newsTexts(t, kind);
  const n = localizeNews(item, lang);
  const d = formatNewsDate(n.publishedAt, lang);
  const summary = n.summary || "";

  return (
    <Link to={newsPath(item, lang, kind)} className="newsx-card" hrefLang={n.jaOnly ? "ja" : undefined}>
      <div className="newsx-card-date">
        <span className="newsx-card-year">{d.year}</span>
        <span className="newsx-card-md">{d.md}</span>
      </div>
      <div className="newsx-card-body">
        {n.category && (
          <span className={`newsx-badge newsx-badge--${n.category}`}>{categoryLabel(n.category, t)}</span>
        )}
        {n.jaOnly && tn.jaOnly && <span className="newsx-badge newsx-badge--ja">{tn.jaOnly}</span>}
        <span className="newsx-card-title" lang={n.jaOnly ? "ja" : undefined}>{n.title}</span>
        {summary && <span className="newsx-card-summary" lang={n.jaOnly ? "ja" : undefined}>{summary}</span>}
      </div>
      <span className="newsx-card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
