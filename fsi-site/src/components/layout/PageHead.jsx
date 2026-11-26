/**
 * @file PageHead.jsx
 * @description ページごとのメタ情報（タイトル・説明文・SNS共有カードなど）を出力する。
 * React 19 の機能で、ここに書いた <title> / <meta> / <link> は自動的に <head> に入る。
 *
 * 使い方:
 *   <PageHead title="企業情報" description="..." />           → 「企業情報 | サイト名」
 *   <PageHead fullTitle="サイト名｜システム開発…" />            → タイトルをそのまま使う（トップページ）
 *   <PageHead title={記事タイトル} type="article" jsonLd={構造化データ} langs={["ja"]} />
 *
 * 廉価版（SITE_URL が設定されている版）では、さらに次も出力する。
 *   - canonical（このページの正式なURL）
 *   - og:url / og:image（SNSに貼ったときのカード）
 *   - hreflang（日本語ページと英語ページの対応）
 *   - RSS フィードの場所、検索エンジンの所有権確認タグ
 * 公開URLが決まっていないビルド（NOINDEX_ALL）は、全ページを検索エンジンに登録させない。
 */
import { useLocation } from "react-router-dom";
import { SITE_URL, LANGS, FEATURES, NOINDEX_ALL, SEARCH_VERIFICATION } from "@edition/config";
import { useContent } from "../../content";
import { langFromPath, localizePath, stripLang } from "../../i18n/lang";
import { absoluteUrl, canonicalPath } from "./seo";

/**
 * @param {Object} props
 * @param {string} [props.title] - ページ固有のタイトル（「タイトル | サイト名」になる）
 * @param {string} [props.fullTitle] - サイト名を付けずにそのまま使うタイトル
 * @param {string} [props.description] - ページの説明文（省略時は既定の文）
 * @param {string} [props.image] - SNS カード用の画像パス（省略時は /ogp.png）
 * @param {"website"|"article"} [props.type] - ページの種類
 * @param {Object|Object[]} [props.jsonLd] - 構造化データ（検索結果のリッチ表示用）
 * @param {boolean} [props.noindex] - 検索エンジンに登録させない（404ページ・検索結果ページなど）
 * @param {string[]} [props.langs] - このページがある言語（英語版のない記事は ["ja"]）
 */
export default function PageHead({ title, fullTitle, description, image, type = "website", jsonLd, noindex = false, langs = LANGS }) {
  const { pathname } = useLocation();
  const t = useContent();
  const lang = langFromPath(pathname);

  const siteName = t.common.siteName;
  const pageTitle = fullTitle || (title ? `${title} | ${siteName}` : siteName);
  const desc = description || t.common.defaultDescription;
  const blockIndex = noindex || NOINDEX_ALL;

  const path = canonicalPath(pathname);
  const url = blockIndex ? "" : absoluteUrl(path);
  const imageUrl = SITE_URL ? absoluteUrl(image || "/ogp.png") : "";
  const hasEn = LANGS.includes("en") && langs.includes("en");
  const basePath = stripLang(path);
  const jaUrl = absoluteUrl(canonicalPath(basePath));
  const enUrl = absoluteUrl(localizePath(basePath, "en"));

  const ldList = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean);

  return (
    <>
      {/* ブラウザタブ・検索結果に表示されるタイトル */}
      <title>{pageTitle}</title>
      {/* 検索結果に表示される説明文 */}
      <meta name="description" content={desc} />
      {blockIndex && <meta name="robots" content="noindex" />}
      {!blockIndex && <meta name="robots" content="max-image-preview:large" />}

      {/* 検索エンジンの所有権確認（Search Console / Bing Webmaster Tools） */}
      {SEARCH_VERIFICATION.google && <meta name="google-site-verification" content={SEARCH_VERIFICATION.google} />}
      {SEARCH_VERIFICATION.bing && <meta name="msvalidate.01" content={SEARCH_VERIFICATION.bing} />}

      {/* SNSでシェアされた時に表示されるOGP（Open Graph Protocol）情報 */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "ja_JP"} />
      {url && <meta property="og:url" content={url} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:width" content="1200" />}
      {imageUrl && <meta property="og:image:height" content="630" />}
      {imageUrl && <meta name="twitter:card" content="summary_large_image" />}

      {/* このページの正式なURLと、他の言語のページ */}
      {url && <link rel="canonical" href={url} />}
      {url && hasEn && <link rel="alternate" hrefLang="ja" href={jaUrl} />}
      {url && hasEn && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {url && hasEn && <link rel="alternate" hrefLang="x-default" href={jaUrl} />}

      {/* RSS フィード（ニュースの更新を受け取る仕組み） */}
      {FEATURES.rss && (
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteName} ${t.common.news.heading}`}
          href={lang === "en" ? "/en/feed.xml" : "/feed.xml"}
        />
      )}

      {/* 構造化データ（JSON-LD）。検索結果に会社情報・パンくず・記事・求人などを出すのに使われる */}
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
