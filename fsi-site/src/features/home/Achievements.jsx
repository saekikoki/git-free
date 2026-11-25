/**
 * @file Achievements.jsx
 * @description 実績紹介セクション。
 * 上部に主要KPI（実績サマリー。画面に入るとカウントアップ）、下部に事例カルーセルを表示する。
 * カルーセルは5秒ごとに自動送り、ホバーで停止、前後ボタン・ドットで手動操作可能。
 * 文言・数値は src/content/{ja,en}/home.js の achievements。
 */

import { useState, useEffect, useCallback } from "react";
import { useContent } from "../../content";
import CountUp from "../../components/ui/CountUp";

export default function Achievements() {
  const t = useContent().home.achievements;
  const items = t.items;
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlay) return;
    // 「視差効果を減らす」設定の端末では自動送りしない
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, next]);

  const activeItem = items[current];

  return (
    <section id="achievements" className="section achievements">
      <h2 className="section-heading">{t.title}</h2>
      <p className="section-subheading">{t.sub}</p>

      {/* KPIサマリー */}
      <div className="stats-grid">
        {t.stats.map((s) => (
          <div key={s.id} className="stat-card">
            <div className="stat-value">
              <CountUp value={s.value} /><span className="stat-unit">{s.unit}</span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 導入事例カルーセル */}
      <div
        className="showcase"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        onFocus={() => setIsAutoPlay(false)}
        onBlur={() => setIsAutoPlay(true)}
        role="region"
        aria-roledescription={t.carouselRole}
        aria-label={t.carouselLabel}
      >
        <button className="showcase-nav showcase-nav-prev" onClick={prev} aria-label={t.prev}>‹</button>

        <div className="showcase-viewport" aria-live="polite">
          {items.map((item, index) => (
            <article
              key={item.id}
              className={`showcase-card ${index === current ? "is-active" : ""}`}
              style={{ "--accent": item.color }}
              aria-hidden={index !== current}
            >
              {/* 左: ビジュアル面 */}
              <div className="showcase-visual" style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)` }}>
                <span className="showcase-icon" aria-hidden="true">{item.icon}</span>
                <span className="showcase-category">{item.category}</span>
              </div>
              {/* 右: テキスト面 */}
              <div className="showcase-body">
                <h3 className="showcase-title">{item.title}</h3>
                <p className="showcase-desc">{item.description}</p>
                <div className="showcase-metric">
                  <span className="showcase-metric-label">{item.metric}</span>
                  <span className="showcase-metric-value">{item.metricValue}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="showcase-nav showcase-nav-next" onClick={next} aria-label={t.next}>›</button>
      </div>

      {/* ドットインジケーター */}
      <div className="showcase-dots">
        {items.map((item, i) => (
          <button
            key={item.id}
            className={`showcase-dot ${i === current ? "is-active" : ""}`}
            style={i === current ? { background: activeItem.color } : undefined}
            onClick={() => setCurrent(i)}
            aria-label={`${t.dot} ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
