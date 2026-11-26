/**
 * seo.js - 検索エンジン・SNS 向けの URL や構造化データ（JSON-LD）を作る関数
 *
 * 構造化データは、ページの内容を検索エンジンに正確に伝えるためのデータ。
 * 検索結果に会社情報・パンくず・求人などが表示されやすくなる。
 * 会社の情報は src/content/company-profile.js から取る。
 *
 * SITE_URL（公開URL）が空のとき（フル版・手元の確認用ビルド）は、URL を含むデータを作らない。
 */
import { SITE_URL } from "@edition/config";
import profile from "../../content/company-profile";
import { withTrailingSlash } from "../../i18n/lang";

/** 正規化したパス。廉価版はページごとに「/company/index.html」を置くので末尾に / を付ける */
export function canonicalPath(pathname = "/") {
  return withTrailingSlash(pathname.split(/[?#]/)[0] || "/");
}

/** サイト内のパスを https://... の絶対URLにする（SITE_URL がなければ空文字） */
export function absoluteUrl(path = "/") {
  if (!SITE_URL) return "";
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

const ORG_ID = () => `${absoluteUrl("/")}#organization`;

/** 住所（構造化データ用） */
export function postalAddress(lang = "ja") {
  const a = profile.address;
  return {
    "@type": "PostalAddress",
    postalCode: a.postalCode,
    addressRegion: a.region[lang] || a.region.ja,
    addressLocality: a.locality[lang] || a.locality.ja,
    streetAddress: a.street[lang] || a.street.ja,
    addressCountry: a.country,
  };
}

/** 会社情報。トップページと企業情報ページに埋め込む */
export function organizationJsonLd({ description, lang = "ja" }) {
  if (!SITE_URL) return null;
  const sameAs = Object.values(profile.sns).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID(),
    name: profile.siteName,
    legalName: profile.legalName[lang] || profile.legalName.ja,
    alternateName: profile.legalName[lang === "en" ? "ja" : "en"],
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.svg"),
    image: absoluteUrl("/ogp.png"),
    description,
    foundingDate: profile.foundingDate,
    address: postalAddress(lang),
    telephone: profile.phoneIntl,
    email: profile.email,
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: profile.phoneIntl,
      email: profile.email,
      availableLanguage: ["Japanese", "English"],
    },
  };
}

/** サイト全体の情報。検索結果に表示されるサイト名に使われる（トップページに埋め込む） */
export function websiteJsonLd(lang = "ja") {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.siteName,
    alternateName: profile.legalName[lang] || profile.legalName.ja,
    url: absoluteUrl(lang === "en" ? "/en/" : "/"),
    inLanguage: lang,
    publisher: { "@id": ORG_ID() },
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

/** 事業（サービス）の構造化データ */
export function serviceJsonLd({ name, description, path, serviceType }) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: absoluteUrl(canonicalPath(path)),
    provider: { "@id": ORG_ID(), "@type": "Organization", name: profile.siteName },
    areaServed: { "@type": "Country", name: "Japan" },
  };
}

/** 記事（ニュース・コラム・導入事例）の構造化データ */
export function articleJsonLd({ type = "Article", headline, description, path, datePublished, dateModified, image, lang, author }) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    description,
    inLanguage: lang,
    mainEntityOfPage: absoluteUrl(canonicalPath(path)),
    image: [absoluteUrl(image || "/ogp.png")],
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
    author: author
      ? { "@type": "Organization", name: `${profile.siteName} ${author}` }
      : { "@type": "Organization", name: profile.siteName, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: profile.siteName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") },
    },
  };
}

/**
 * 求人の構造化データ（Google の求人検索に載せるための情報）。
 * Google の決まりで、1つの求人の詳細ページにだけ入れる（一覧ページには入れない）。
 */
export function jobPostingJsonLd({ job, descriptionHtml, lang }) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionHtml,
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: `${job.validThrough}T23:59:59+09:00` } : {}),
    employmentType: job.employmentType || "FULL_TIME",
    identifier: { "@type": "PropertyValue", name: profile.siteName, value: job.slug },
    hiringOrganization: {
      "@type": "Organization",
      name: profile.legalName[lang] || profile.legalName.ja,
      sameAs: absoluteUrl("/"),
      logo: absoluteUrl("/favicon.svg"),
    },
    jobLocation: { "@type": "Place", address: postalAddress(lang) },
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "JPY",
            value: { "@type": "QuantitativeValue", minValue: job.salary.min, maxValue: job.salary.max, unitText: "YEAR" },
          },
        }
      : {}),
    directApply: false,
  };
}
