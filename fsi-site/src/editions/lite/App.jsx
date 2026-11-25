/**
 * 廉価版のルーティング定義
 *
 * S3静的ホスティングだけで動く版。サーバー・DBを一切使わない。
 * 掲示板・チャット・ゲーム・ログイン・管理画面は含まない。
 *
 * すべてのページに日本語版（/company）と英語版（/en/company）がある。
 * ビルド時に、ここに並べたページを1枚ずつHTMLとして書き出す（entry-server.jsx）。
 */
import { Routes, Route } from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/layout/ScrollToTop";

import Home from "../../features/home/HomePage";
import NewsList from "../../features/news/NewsListPage";
import NewsDetail from "../../features/news/NewsDetailPage";
import CompanyPage from "../../features/company/CompanyPage";
import RecruitPage from "../../features/company/RecruitPage";
import Privacy from "../../features/legal/PrivacyPage";
import Terms from "../../features/legal/TermsPage";
import Sitemap from "../../features/legal/SitemapPage";
import FaqPage from "../../features/faq/FaqPage";
import SearchPage from "../../features/search/SearchPage";
import NotFoundPage from "../../features/errors/NotFoundPage";
// 廉価版専用のお問い合わせページ（フォームなし、メールアドレスと電話番号を案内）
import ContactPage from "./ContactPage";
import useLitePageEffects from "./useLitePageEffects";
import { PAGE_PATHS, enPath } from "./routes";

// URL ごとに表示する画面（URL の一覧は routes.js）
const PAGE_ELEMENTS = {
  "/": <Home />,
  "/news": <NewsList />,
  "/news/:sk": <NewsDetail />,
  "/company": <CompanyPage />,
  "/recruit": <RecruitPage />,
  "/contact": <ContactPage />,
  "/faq": <FaqPage />,
  "/search": <SearchPage />,
  "/privacy": <Privacy />,
  "/terms": <Terms />,
  "/sitemap": <Sitemap />,
};

export default function App() {
  useLitePageEffects();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          {PAGE_PATHS.map(({ path }) => (
            <Route key={path} path={path} element={PAGE_ELEMENTS[path]} />
          ))}
          {PAGE_PATHS.map(({ path }) => (
            <Route key={`en${path}`} path={enPath(path)} element={PAGE_ELEMENTS[path]} />
          ))}
          {/* 未定義のURLは「ページが見つかりません」を表示（S3/CloudFront の 404.html と同じ画面） */}
          <Route path="/en/*" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
