/**
 * NewsDetailPage.jsx - ニュース詳細ページ（上場企業級IR記事）
 * URL: /news/:sk（英語: /en/news/:sk）
 *
 * 機能:
 *   - 記事ヘッダー（日付・カテゴリ・タイトル）
 *   - 本文（廉価版は Markdown を HTML にしたもの、フル版はテキスト）
 *   - SNS シェア（X / Facebook / LinkedIn）・リンクのコピー・印刷
 *   - 前の記事 / 次の記事、同じカテゴリの関連ニュース
 *   - 検索エンジン向けの記事情報（構造化データ）
 */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Link from "../../i18n/LocalizedLink";
import PageHead from "../../components/layout/PageHead";
import useHydrated from "../../components/ui/useHydrated";
import { absoluteUrl, breadcrumbJsonLd, canonicalPath } from "../../components/layout/seo";
import { localizePath, useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import NewsCard from "./NewsCard";
import { categoryLabel, formatNewsDate, localizeNews, useNewsItem, useNewsList } from "./newsUtils";

const RELATED_MAX = 3;

export default function NewsDetailPage() {
  const { sk } = useParams();
  const lang = useLang();
  const t = useContent();
  const tn = t.common.news;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [copied, setCopied] = useState(false);

  const { article: raw, error } = useNewsItem(sk);
  const list = useNewsList();
  const article = localizeNews(raw, lang);

  // 前後の記事（一覧は新しい順なので、index - 1 が「次（新しい）」）と、同じカテゴリの関連記事
  const { prevItem, nextItem, related } = useMemo(() => {
    const index = list.findIndex((n) => n.SK === sk);
    return {
      nextItem: index > 0 ? list[index - 1] : null,
      prevItem: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
      related: raw
        ? list.filter((n) => n.SK !== sk && n.category === raw.category).slice(0, RELATED_MAX)
        : [],
    };
  }, [list, sk, raw]);

  if (error) {
    return (
      <div className="newsx">
        <PageHead title={tn.notFoundTitle} noindex />
        <section className="newsx-hero"><div className="corp-container"><h1 className="newsx-hero-title">{tn.notFoundTitle}</h1></div></section>
        <section className="corp-section">
          <div className="corp-container" style={{ textAlign: "center" }}>
            <p className="newsx-empty">{tn.notFoundText}</p>
            <Link to="/news" className="hero-v2-btn hero-v2-btn-primary">{tn.toList}</Link>
          </div>
        </section>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="newsx">
        <section className="corp-section">
          <div className="corp-container" style={{ textAlign: "center" }}>
            <p className="newsx-empty">{tn.loading}</p>
          </div>
        </section>
      </div>
    );
  }

  const d = formatNewsDate(article.publishedAt, lang);
  const path = localizePath(`/news/${article.SK}`, lang);
  const description = article.summary || String(article.content || "").slice(0, 120);

  // シェア用のURL。SITE_URL がない版（フル版）はブラウザで開いているURLを使う
  const shareUrl = absoluteUrl(canonicalPath(path)) || (hydrated ? window.location.href.split(/[?#]/)[0] : "");
  const enc = encodeURIComponent;
  const shareLinks = shareUrl
    ? [
        { name: "X", href: `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(article.title)}` },
        { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}` },
        { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}` },
      ]
    : [];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // コピーできない環境では何もしない
    }
  };

  // 本文中のサイト内リンク（/company など）は、ページを再読み込みせずに移動する
  const onArticleClick = (e) => {
    const a = e.target.closest?.("a");
    const href = a?.getAttribute("href");
    if (!href || !href.startsWith("/") || href.startsWith("//") || a.target === "_blank") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  const jsonLd = [
    absoluteUrl("/") && {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      datePublished: d.iso,
      inLanguage: article.jaOnly ? "ja" : lang,
      mainEntityOfPage: absoluteUrl(canonicalPath(path)),
      image: [absoluteUrl(article.image || "/ogp.png")],
      publisher: { "@type": "Organization", name: t.common.siteName, logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") } },
      description,
    },
    breadcrumbJsonLd([
      { name: t.common.breadcrumbTop, path: localizePath("/", lang) },
      { name: tn.heading, path: localizePath("/news", lang) },
      { name: article.title, path },
    ]),
  ];

  return (
    <div className="newsx">
      <PageHead title={article.title} description={description} type="article" image={article.image || undefined} jsonLd={jsonLd} />

      {/* ヒーロー */}
      <section className="newsx-hero">
        <div className="corp-container">
          <p className="corp-hero-eyebrow">{tn.eyebrow}</p>
          <div className="newsx-detail-meta">
            <time dateTime={d.iso}>{d.full}</time>
            {article.category && (
              <span className={`newsx-badge newsx-badge--${article.category}`}>{categoryLabel(article.category, t)}</span>
            )}
          </div>
          <h1 className="newsx-detail-title">{article.title}</h1>
        </div>
      </section>

      {/* パンくず */}
      <nav className="corp-breadcrumb" aria-label={t.common.breadcrumbLabel}>
        <div className="corp-container">
          <Link to="/">{t.common.breadcrumbTop}</Link>
          <span className="corp-sep">/</span>
          <Link to="/news">{tn.heading}</Link>
          <span className="corp-sep">/</span>
          <span>{article.title}</span>
        </div>
      </nav>

      {/* 本文 */}
      <section className="corp-section">
        <div className="corp-container newsx-article-wrap">
          {article.jaOnly && tn.langNotice && <p className="newsx-lang-notice">{tn.langNotice}</p>}

          {article.image && <img className="newsx-article-image" src={article.image} alt="" />}

          {article.html ? (
            <article
              className="newsx-article newsx-markdown"
              lang={article.jaOnly ? "ja" : undefined}
              onClick={onArticleClick}
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          ) : (
            <article className="newsx-article">
              {String(article.content || "").split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </article>
          )}

          {/* シェア・コピー・印刷 */}
          <div className="newsx-share no-print">
            <span className="newsx-share-label">{tn.share}</span>
            {shareLinks.map((s) => (
              <a key={s.name} className="newsx-share-btn" href={s.href} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
            <button type="button" className="newsx-share-btn" onClick={copyLink}>
              {copied ? tn.copied : tn.copyLink}
            </button>
            <button type="button" className="newsx-share-btn" onClick={() => window.print()}>
              {tn.print}
            </button>
          </div>

          {/* 前の記事 / 次の記事 */}
          {(prevItem || nextItem) && (
            <nav className="newsx-prevnext no-print" aria-label={`${tn.prevArticle} / ${tn.nextArticle}`}>
              {prevItem ? (
                <Link to={`/news/${prevItem.SK}`} className="newsx-prevnext-link is-prev">
                  <span className="newsx-prevnext-label">← {tn.prevArticle}</span>
                  <span className="newsx-prevnext-title">{localizeNews(prevItem, lang).title}</span>
                </Link>
              ) : <span />}
              {nextItem ? (
                <Link to={`/news/${nextItem.SK}`} className="newsx-prevnext-link is-next">
                  <span className="newsx-prevnext-label">{tn.nextArticle} →</span>
                  <span className="newsx-prevnext-title">{localizeNews(nextItem, lang).title}</span>
                </Link>
              ) : <span />}
            </nav>
          )}

          {/* 関連ニュース */}
          {related.length > 0 && (
            <div className="newsx-related no-print">
              <h2 className="newsx-related-title">{tn.related}</h2>
              <ul className="newsx-list">
                {related.map((n) => (
                  <li key={n.SK}><NewsCard item={n} /></li>
                ))}
              </ul>
            </div>
          )}

          <div className="newsx-detail-footer no-print">
            <Link to="/news" className="newsx-back-btn">{tn.backToList}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
