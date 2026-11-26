/**
 * HomePage.jsx - トップページ
 *
 * 構成:
 *   1. Hero        … メインビジュアル
 *   2. Services    … 事業内容（各事業の詳細ページへ）
 *   3. NewsSection … 最新ニュース（薄グレー背景で区切る）
 *   4. Achievements… 実績紹介（KPI + 導入事例カルーセル）
 *   5. コラム      … 最新コラム3件（廉価版のみ）
 *
 * 検索エンジン向けに、会社情報（Organization）とサイト情報（WebSite）の構造化データを出力する。
 */
import Hero from "./Hero";
import Services from "./Services";
import News from "../news/NewsSection";
import Achievements from "./Achievements";
import PageHead from "../../components/layout/PageHead";
import { organizationJsonLd, websiteJsonLd } from "../../components/layout/seo";
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import { FEATURES } from "@edition/config";

export default function Home() {
  const lang = useLang();
  const t = useContent();
  const description = t.home.description;

  return (
    <>
      <PageHead
        fullTitle={t.home.title}
        description={description}
        jsonLd={[organizationJsonLd({ description, lang }), websiteJsonLd(lang)]}
      />
      {/* ページの見出し（h1）は Hero の中にある */}
      <Hero />
      <Services />
      <section id="news" className="home-news-wrap">
        <News />
      </section>
      <Achievements />
      {FEATURES.columns && (
        <section id="columns" className="home-news-wrap home-columns-wrap">
          <News kind="columns" max={3} heading={t.home.columns.heading} />
        </section>
      )}
    </>
  );
}
