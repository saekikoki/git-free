/**
 * NewsSection.jsx - トップページのニュースセクション
 *
 * 最新ニュースを取得し、最新5件をカード型で表示する。
 * 下部に「ニュース一覧を表示する」ボタンを配置し、/news へ遷移できる。
 * デザインは一覧ページ（NewsListPage）のカードと統一。
 */
import Link from "../../i18n/LocalizedLink";
import { useContent } from "../../content";
import NewsCard from "./NewsCard";
import { useNewsList } from "./newsUtils";

// トップページに表示する最大件数
const MAX_DISPLAY = 5;

export default function NewsSection() {
  const t = useContent().common.news;
  // フル版はAPI、廉価版はMarkdownから取得（@edition/dataSource が切り替える）
  const news = useNewsList();
  const displayed = news.slice(0, MAX_DISPLAY);

  return (
    <section className="news-section">
      <h2 className="news-heading">{t.heading}</h2>

      {displayed.length === 0 ? (
        <p className="newsx-empty">{t.empty}</p>
      ) : (
        <ul className="newsx-list newsx-list--home">
          {displayed.map((n) => (
            <li key={n.SK}><NewsCard item={n} /></li>
          ))}
        </ul>
      )}

      {/* ニュース一覧ページへの遷移ボタン */}
      <div className="news-more">
        <Link to="/news" className="news-more-btn">{t.more}</Link>
      </div>
    </section>
  );
}
