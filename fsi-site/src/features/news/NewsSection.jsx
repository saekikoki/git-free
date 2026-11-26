/**
 * NewsSection.jsx - トップページのニュース（またはコラム）セクション
 *
 * 最新記事を取得し、最新5件をカード型で表示する。
 * 下部に一覧ページへのボタンを置く。デザインは一覧ページ（NewsListPage）のカードと統一。
 *
 *   <NewsSection />                                   … ニュース
 *   <NewsSection kind="columns" max={3} heading="コラム" /> … コラム（廉価版）
 */
import Link from "../../i18n/LocalizedLink";
import { useContent } from "../../content";
import NewsCard from "./NewsCard";
import { listPath, newsTexts, useNewsList } from "./newsUtils";

export default function NewsSection({ kind = "news", max = 5, heading }) {
  const tn = newsTexts(useContent(), kind);
  // フル版はAPI、廉価版はMarkdownから取得（@edition/dataSource が切り替える）
  const news = useNewsList(kind);
  const displayed = news.slice(0, max);

  return (
    <section className="news-section">
      <h2 className="news-heading">{heading || tn.heading}</h2>

      {displayed.length === 0 ? (
        <p className="newsx-empty">{tn.empty}</p>
      ) : (
        <ul className="newsx-list newsx-list--home">
          {displayed.map((n) => (
            <li key={n.SK}><NewsCard item={n} kind={kind} /></li>
          ))}
        </ul>
      )}

      <div className="news-more">
        <Link to={listPath(kind)} className="news-more-btn">{tn.more}</Link>
      </div>
    </section>
  );
}
