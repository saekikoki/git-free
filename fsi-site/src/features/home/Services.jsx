/**
 * @file Services.jsx
 * @description 事業内容（サービス紹介）セクション。
 * 3つの主要サービスをアイコン付きカードで紹介する。
 * スクロールで画面に入ると順にフェードインする。
 * 文言は src/content/{ja,en}/home.js の services。
 */
import useReveal from "../../components/ui/useReveal";
import { useContent } from "../../content";

export default function Services() {
  const t = useContent().home.services;
  const [ref, visible] = useReveal();

  return (
    <section id="services" className="services-v2">
      <div className="services-v2-container">
        <div className="services-v2-head">
          <p className="services-v2-eyebrow">{t.eyebrow}</p>
          <h2 className="services-v2-title">{t.title}</h2>
          <p className="services-v2-sub">{t.sub}</p>
        </div>

        <div ref={ref} className={`services-v2-grid ${visible ? "is-visible" : ""}`}>
          {t.items.map((s, i) => (
            <article key={s.title} className="service-v2-card" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="service-v2-icon" aria-hidden="true">{s.icon}</div>
              <h3 className="service-v2-name">{s.title}</h3>
              <p className="service-v2-text">{s.text}</p>
              <div className="service-v2-tags">
                {s.tags.map((tag) => (
                  <span key={tag} className="service-v2-tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
