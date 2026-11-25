/**
 * NewsListPage.jsx - ニュースリリース一覧ページ（上場企業級IRニュース）
 * URL: /news（英語: /en/news）
 *
 * 機能:
 *   - カテゴリによる絞り込みタブ
 *   - 年による絞り込み
 *   - キーワード検索（見出しと本文）
 *   - ページ送り（10件ずつ）
 *   - 絞り込みの状態は URL（?category=製品&year=2025&q=...&page=2）に残るので、そのまま共有できる
 *   - RSS フィードへのリンク（廉価版）
 */
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import useHydrated from "../../components/ui/useHydrated";
import { breadcrumbJsonLd } from "../../components/layout/seo";
import { useLang, localizePath } from "../../i18n/lang";
import { useContent } from "../../content";
import { FEATURES } from "@edition/config";
import NewsCard from "./NewsCard";
import { categoryLabel, localizeNews, useNewsList } from "./newsUtils";

const PAGE_SIZE = 10;

export default function NewsListPage() {
  const lang = useLang();
  const t = useContent();
  const tn = t.common.news;
  const news = useNewsList();
  const [params, setParams] = useSearchParams();

  // 事前HTML化したページは「絞り込みなし」の状態。URLの条件はブラウザで引き継いだ後に反映する
  const hydrated = useHydrated();
  const category = hydrated ? params.get("category") || "" : "";
  const year = hydrated ? params.get("year") || "" : "";
  const query = hydrated ? params.get("q") || "" : "";
  const page = hydrated ? Math.max(1, Number(params.get("page")) || 1) : 1;

  /** URL の条件を書き換える（空の値は消す。条件を変えたら1ページ目に戻す） */
  const update = (changes) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, String(value));
    }
    if (!("page" in changes)) next.delete("page");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  // カテゴリ・年の一覧を記事から作る
  const categories = useMemo(() => [...new Set(news.map((n) => n.category).filter(Boolean))], [news]);
  const years = useMemo(
    () => [...new Set(news.map((n) => String(n.publishedAt).slice(0, 4)))].sort().reverse(),
    [news]
  );

  // 絞り込み + 検索（英語ページでは英語の見出し・本文も対象）
  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return news.filter((item) => {
      const n = localizeNews(item, lang);
      if (category && n.category !== category) return false;
      if (year && !String(n.publishedAt).startsWith(year)) return false;
      if (!words.length) return true;
      const text = `${n.title} ${n.content || ""} ${n.summary || ""}`.toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [news, category, year, query, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goPage = (p) => {
    update({ page: p === 1 ? "" : p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="newsx">
      <PageHead
        title={tn.heading}
        description={tn.description}
        jsonLd={breadcrumbJsonLd([
          { name: t.common.breadcrumbTop, path: localizePath("/", lang) },
          { name: tn.heading, path: localizePath("/news", lang) },
        ])}
      />

      {/* ヒーロー */}
      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{tn.eyebrow}</p>
          <h1 className="newsx-hero-title">{tn.heading}</h1>
          <p className="newsx-hero-lead">{tn.lead}</p>
        </div>
      </section>

      {/* パンくず */}
      <nav className="corp-breadcrumb" aria-label={t.common.breadcrumbLabel}>
        <div className="corp-container">
          <Link to="/">{t.common.breadcrumbTop}</Link>
          <span className="corp-sep">/</span>
          <span>{tn.heading}</span>
        </div>
      </nav>

      <section className="corp-section">
        <div className="corp-container">
          {/* フィルターバー */}
          <div className="newsx-toolbar">
            <div className="newsx-tabs" role="group" aria-label={tn.heading}>
              {["", ...categories].map((cat) => (
                <button
                  key={cat || "all"}
                  type="button"
                  className={`newsx-tab ${category === cat ? "is-active" : ""}`}
                  aria-pressed={category === cat}
                  onClick={() => update({ category: cat })}
                >
                  {cat ? categoryLabel(cat, t) : tn.all}
                </button>
              ))}
            </div>
            <div className="newsx-filters">
              <select
                className="newsx-year-select"
                aria-label={tn.yearLabel}
                value={year}
                onChange={(e) => update({ year: e.target.value })}
              >
                <option value="">{tn.allYears}</option>
                {years.map((y) => (
                  <option key={y} value={y}>{lang === "en" ? y : `${y}年`}</option>
                ))}
              </select>
              <div className="newsx-search">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => update({ q: e.target.value })}
                  placeholder={tn.searchPlaceholder}
                  aria-label={tn.searchLabel}
                  className="newsx-search-input"
                />
              </div>
            </div>
          </div>

          {/* 件数表示 */}
          <div className="newsx-meta-row">
            <p className="newsx-count" aria-live="polite">{filtered.length} {tn.countSuffix}</p>
            {FEATURES.rss && (
              <a className="newsx-rss" href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}>
                <span aria-hidden="true">◉</span> {tn.rss}
              </a>
            )}
          </div>

          {/* ニュース一覧 */}
          {shown.length === 0 ? (
            <p className="newsx-empty">{news.length === 0 ? tn.empty : tn.noMatch}</p>
          ) : (
            <ul className="newsx-list">
              {shown.map((n) => (
                <li key={n.SK}><NewsCard item={n} /></li>
              ))}
            </ul>
          )}

          {/* ページ送り */}
          {totalPages > 1 && (
            <nav className="newsx-pagination" aria-label={tn.pagination}>
              <button type="button" disabled={currentPage === 1} onClick={() => goPage(currentPage - 1)}>
                ‹ {tn.prevPage}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={p === currentPage ? "is-active" : ""}
                  aria-current={p === currentPage ? "page" : undefined}
                  onClick={() => goPage(p)}
                >
                  {p}
                </button>
              ))}
              <button type="button" disabled={currentPage === totalPages} onClick={() => goPage(currentPage + 1)}>
                {tn.nextPage} ›
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
