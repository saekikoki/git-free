import { useState } from "react";

function formatDate(d) {
const dt = new Date(d);
return dt.toLocaleDateString("ja-JP", { year:"numeric", month:"long", day:"numeric" });
}

const initialNews = [
{
SK: "2026-06-01-001",
publishedAt: "2026-06-01T09:00:00Z",
category: "info",
title: "サービス開始のお知らせ"
},
{
SK: "2026-06-10-002",
publishedAt: "2026-06-10T12:30:00Z",
category: "update",
title: "機能改善を行いました"
}
];

export default function News() {
const [news, setNews] = useState(initialNews);

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