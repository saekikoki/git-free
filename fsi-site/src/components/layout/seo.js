/**
 * seo.js - 検索エンジン・SNS 向けの URL や構造化データ（JSON-LD）を作る関数
 *
 * SITE_URL（src/editions/lite/config.js）が空のとき（フル版）は、絶対URLを作らない。
 */
import { SITE_URL, CONTACT_EMAIL, CONTACT_PHONE } from "@edition/config";

/** 正規化したパス。廉価版はページごとに「/company/index.html」を置くので末尾に / を付ける */
export function canonicalPath(pathname = "/") {
  const p = pathname.split(/[?#]/)[0] || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

/** サイト内のパスを https://... の絶対URLにする（SITE_URL がなければ空文字） */
export function absoluteUrl(path = "/") {
  if (!SITE_URL) return "";
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

/** 会社情報の構造化データ（トップページに埋め込む） */
export function organizationJsonLd({ name, description }) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.svg"),
    description,
    ...(CONTACT_EMAIL || CONTACT_PHONE
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
            ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
            availableLanguage: ["Japanese", "English"],
          },
        }
      : {}),
  };
}

/** パンくずの構造化データ。items = [{ name, path }, ...] */
export function breadcrumbJsonLd(items) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(canonicalPath(item.path)),
    })),
  };
}
