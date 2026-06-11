import { useEffect, useState } from "react";

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("ja-JP", { year:"numeric", month:"long", day:"numeric" });
}

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(console.error);
  }, []);

  return (
    <section id="news" className="news-section">
      <h2 className="news-heading">ニュースリリース</h2>
      <ul className="news-list">
        {news.map(n => (
          <li key={n.SK} className="news-item">
            <time className="news-time" dateTime={n.publishedAt}>
              {formatDate(n.publishedAt)}
            </time>

            <div className="news-main">
              {n.category && <span className={`news-badge news-badge--${n.category}`}>{n.category}</span>}
              <a href={`/news/${n.SK}`} className="news-title">{n.title}</a>
            </div>

            <a href={`/news/${n.SK}`} className="news-action" aria-label={`ニュース詳細: ${n.title}`}>
              <span className="news-arrow">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}