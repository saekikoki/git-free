/**
 * NotFoundPage.jsx - 404（ページが見つかりません）
 *
 * 廉価版では、ビルド時にこのページを dist-lite/404.html として書き出し、
 * S3（または CloudFront）が「存在しないURL」に対して返すページに設定する。
 * 検索エンジンに登録されないよう noindex を付ける。
 */
import Link from "../../i18n/LocalizedLink";
import { Link as RawLink } from "react-router-dom";
import PageHead from "../../components/layout/PageHead";
import Lines from "../../components/ui/Lines";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { FEATURES, LANGS } from "@edition/config";

export default function NotFoundPage() {
  const lang = useLang();
  const t = useContent().common.notFound;

  return (
    <section className="notfound">
      <PageHead title={t.title} noindex />
      <p className="notfound-code" aria-hidden="true">404</p>
      <h1 className="notfound-title">{t.title}</h1>
      <p className="notfound-text"><Lines text={t.text} /></p>
      <div className="notfound-actions">
        <Link to="/">{t.toTop}</Link>
        {FEATURES.search && <Link to="/search">{t.toSearch}</Link>}
        <Link to="/sitemap">{t.toSitemap}</Link>
      </div>
      {/* 404.html は1つだけなので、日本語ページには英語の案内も添える */}
      {lang === "ja" && LANGS.includes("en") && (
        <p className="notfound-alt" lang="en">
          Page not found. <RawLink to="/en/">Go to the English home page</RawLink>
        </p>
      )}
    </section>
  );
}
