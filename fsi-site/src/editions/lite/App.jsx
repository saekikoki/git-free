/**
 * 廉価版のルーティング定義
 *
 * S3静的ホスティングだけで動く版。サーバー・DBを一切使わない。
 * 掲示板・チャット・ゲーム・ログイン・管理画面は含まない。
 *
 * すべてのページに日本語版（/company/）と英語版（/en/company/）がある。
 * ページの一覧は routes.js、各ページのプログラムの読み込みは pageEntries.js。
 * ビルド時に、全ページを1枚ずつHTMLとして書き出す（entry-server.jsx）。
 */
import { Routes, Route } from "react-router-dom";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/layout/ScrollToTop";
import NotFoundPage from "../../features/errors/NotFoundPage";
import useLitePageEffects from "./useLitePageEffects";
import LazyPage from "./LazyPage";
import { PAGE_PATHS, enPath } from "./routes";
import { PAGE_ENTRIES } from "./pageEntries";
import { FEATURES } from "./config";

// オフにした機能（config.js の FEATURES）のページは作らない
const pages = PAGE_PATHS.filter((p) => !p.feature || FEATURES[p.feature]);

export default function App() {
  useLitePageEffects();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          {pages.map(({ path, props, content }) => (
            <Route key={path} path={path} element={<LazyPage entry={PAGE_ENTRIES[path]} content={content} props={props} />} />
          ))}
          {pages.map(({ path, props, content }) => (
            <Route key={`en${path}`} path={enPath(path)} element={<LazyPage entry={PAGE_ENTRIES[path]} content={content} props={props} />} />
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
