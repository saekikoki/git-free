import { useEffect, useState } from "react";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/news")   // ← CloudFront → API Gateway
      .then(res => res.json())
      .then(data => {
        console.log("API response:", data);
        setNews(data);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="news" className="section">
      <h2>ニュース</h2>
      <ul className="news">
        {news.map(n => (
          <li key={n.SK}>
            <strong>{n.title}</strong>（{n.publishedAt}）
          </li>
        ))}
      </ul>
    </section>
  );
}