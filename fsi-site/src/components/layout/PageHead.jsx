/**
 * @file PageHead.jsx
 * @description ページごとのメタ情報（タイトル・説明文・SNS共有カードなど）を出力する。
 * React 19 の機能で、ここに書いた <title> / <meta> / <link> は自動的に <head> に入る。
 *
 * 使い方:
 *   <PageHead title="企業情報" description="..." />
 *   <PageHead title={記事タイトル} type="article" jsonLd={構造化データ} />
 *
 * 廉価版（SITE_URL が設定されている版）では、さらに次も出力する。
 *   - canonical（このページの正式なURL）
 *   - og:url / og:image（SNSに貼ったときのカード）
 *   - hreflang（日本語ページと英語ページの対応）
 *   - RSS フィードの場所
 */
import { useLocation } from "react-router-dom";
import { SITE_URL, LANGS, FEATURES } from "@edition/config";
import { useContent } from "../../content";
import { langFromPath, localizePath, stripLang } from "../../i18n/lang";
import { absoluteUrl, canonicalPath } from "./seo";

/**
 * @param {Object} props
 * @param {string} [props.title] - ページ固有のタイトル（省略時はサイト名のみ）
 * @param {string} [props.description] - ページの説明文（省略時は既定の文）
 * @param {string} [props.image] - SNS カード用の画像パス（省略時は /ogp.png）
 * @param {"website"|"article"} [props.type] - ページの種類
 * @param {Object|Object[]} [props.jsonLd] - 構造化データ（検索結果のリッチ表示用）
 * @param {boolean} [props.noindex] - 検索エンジンに登録させない（404ページなど）
 */
export default function PageHead({ title, description, image, type = "website", jsonLd, noindex = false }) {
  const { pathname } = useLocation();
  const t = useContent();
  const lang = langFromPath(pathname);

  const siteName = t.common.siteName;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || t.common.defaultDescription;

  const path = canonicalPath(pathname);
  const url = absoluteUrl(path);
  const imageUrl = SITE_URL ? absoluteUrl(image || "/ogp.png") : "";
  const multiLang = LANGS.includes("en");
  const basePath = stripLang(path);
  const jaUrl = absoluteUrl(canonicalPath(basePath));
  const enUrl = absoluteUrl(canonicalPath(localizePath(basePath, "en")));

  const ldList = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean);

  return (
    <>
      {/* ブラウザタブに表示されるタイトル */}
      <title>{fullTitle}</title>
      {/* 検索エンジン向けの説明文 */}
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* SNSでシェアされた時に表示されるOGP（Open Graph Protocol）情報 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "ja_JP"} />
      {url && !noindex && <meta property="og:url" content={url} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:card" content="summary_large_image" />}

      {/* このページの正式なURLと、他の言語のページ */}
      {url && !noindex && <link rel="canonical" href={url} />}
      {url && !noindex && multiLang && <link rel="alternate" hrefLang="ja" href={jaUrl} />}
      {url && !noindex && multiLang && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {url && !noindex && multiLang && <link rel="alternate" hrefLang="x-default" href={jaUrl} />}

      {/* RSS フィード（ニュースの更新を受け取る仕組み） */}
      {FEATURES.rss && (
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteName} ${t.common.news.heading}`}
          href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}
        />
      )}

      {/* 構造化データ（JSON-LD）。検索結果にパンくずや記事情報を出すのに使われる */}
      {ldList.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          // "<" をエスケープして、文字列中の </script> でタグが閉じないようにする
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
