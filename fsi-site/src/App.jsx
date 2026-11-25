/**
 * App.jsx - アプリ全体のルーティング（画面振り分け）を定義するファイル
 *
 * URLパスに応じて、どのページコンポーネントを表示するか決めます。
 * 全ページ共通のHeader（ヘッダー）とFooter（フッター）もここで配置します。
 */
import "./styles.css"; // 全体のCSSを読み込み

// 共通レイアウト（全ページで使うヘッダー・フッター）
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

// 各機能のページコンポーネント（features/機能名/ にまとめている）
import Home from "./features/home/HomePage";              // トップページ
import NewsList from "./features/news/NewsListPage";      // ニュース一覧（全件）
import NewsDetail from "./features/news/NewsDetailPage";  // ニュース詳細
import Board from "./features/board/BoardListPage";       // 掲示板スレッド一覧
import BoardThread from "./features/board/BoardThreadPage"; // スレッド詳細
import CompanyPage from "./features/company/CompanyPage"; // 会社概要
import RecruitPage from "./features/company/RecruitPage"; // 採用情報
import ContactPage from "./features/contact/ContactPage"; // お問い合わせ
import Login from "./features/auth/LoginPage";            // ログイン
import Admin from "./features/auth/AdminPage";            // 管理者パネル
import Chat from "./features/chat/ChatPage";              // リアルタイムチャット
import SengokuGame from "./features/game/SengokuGamePage"; // 戦国シミュレーションゲーム
import Privacy from "./features/legal/PrivacyPage";       // 個人情報保護
import Terms from "./features/legal/TermsPage";           // 利用規約
import Sitemap from "./features/legal/SitemapPage";       // サイトマップ
import { Routes, Route } from "react-router-dom"; // ルーティング機能

export default function App() {
  return (
    <>
      {/* ページ遷移時のスクロール制御 + トップへ戻るボタン */}
      <ScrollToTop />

      {/* ヘッダー: 全ページ共通で上部に表示 */}
      <Header />

      {/* メインコンテンツ: URLに応じて中身が切り替わる */}
      <main>
        <Routes>
          {/* path: URLパス、element: 表示するコンポーネント */}
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:sk" element={<NewsDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<BoardThread />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/recruit" element={<RecruitPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/game" element={<SengokuGame />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>
      </main>

      {/* フッター: 全ページ共通で下部に表示 */}
      <Footer />
    </>
  );
}
