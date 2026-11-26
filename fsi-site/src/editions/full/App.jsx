/**
 * フル版のルーティング定義
 *
 * API Gateway + Lambda + DynamoDB を使う全機能版。
 * 掲示板・チャット・ログイン・管理画面を含む。
 */
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../features/auth/AuthContext";
import "../../styles/full-only.css"; // ログイン・管理・掲示板・チャット・ゲームの CSS（廉価版には含めない）

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/layout/ScrollToTop";

// 両エディション共通のページ
import Home from "../../features/home/HomePage";
import NewsList from "../../features/news/NewsListPage";
import NewsDetail from "../../features/news/NewsDetailPage";
import CompanyPage from "../../features/company/CompanyPage";
import RecruitPage from "../../features/company/RecruitPage";
import JobDetailPage from "../../features/company/JobDetailPage";
import ServicesPage from "../../features/services/ServicesPage";
import ServiceDetailPage from "../../features/services/ServiceDetailPage";
import CasesPage from "../../features/cases/CasesPage";
import CaseDetailPage from "../../features/cases/CaseDetailPage";
import ContactPage from "../../features/contact/ContactPage";
import SengokuGame from "../../features/game/SengokuGamePage";
import Privacy from "../../features/legal/PrivacyPage";
import Terms from "../../features/legal/TermsPage";
import Sitemap from "../../features/legal/SitemapPage";

// フル版だけのページ（サーバーが必要）
import Board from "../../features/board/BoardListPage";
import BoardThread from "../../features/board/BoardThreadPage";
import Chat from "../../features/chat/ChatPage";
import Login from "../../features/auth/LoginPage";
import Admin from "../../features/auth/AdminPage";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:sk" element={<NewsDetail />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:slug" element={<CaseDetailPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/recruit" element={<RecruitPage />} />
          <Route path="/recruit/jobs/:slug" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/game" element={<SengokuGame />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />

          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<BoardThread />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}
