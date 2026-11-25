/**
 * HomePage.jsx - トップページ
 *
 * 構成:
 *   1. Hero        … メインビジュアル
 *   2. Services    … 事業内容
 *   3. NewsSection … 最新ニュース（薄グレー背景で区切る）
 *   4. Achievements… 実績紹介（KPI + 事例カルーセル）
 */
import Hero from "./Hero";
import Services from "./Services";
import News from "../news/NewsSection";
import Achievements from "./Achievements";
import PageHead from "../../components/layout/PageHead";
import { organizationJsonLd } from "../../components/layout/seo";
import { useContent } from "../../content";

export default function Home() {
  const t = useContent();
  const description = t.home.description;

  return (
    <>
      <PageHead
        description={description}
        jsonLd={organizationJsonLd({ name: t.common.siteName, description })}
      />
      <Hero />
      <Services />
      <section id="news" className="home-news-wrap">
        <News />
      </section>
      <Achievements />
    </>
  );
}
