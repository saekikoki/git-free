import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <h1 className="logo">FSI-STYLE CORP</h1>

      {/* PCナビ */}
      <nav className="pc-nav">
        <a href="/#services">事業内容</a>
        <a href="/#news">ニュース</a>
        <Link to="/page1">企業情報</Link>
        <a href="/#contact">お問い合わせ</a>
      </nav>

      {/* ハンバーガーボタン */}
      <button
        className="menu-button"
        aria-label="メニュー"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "×" : "☰"}
      </button>

      {/* モバイルメニュー */}
      {isOpen && (
        <nav className="mobile-nav">
          <a href="#services" onClick={() => setIsOpen(false)}>事業内容</a>
          <a href="#news" onClick={() => setIsOpen(false)}>ニュース</a>
          <Link to="/page1" onClick={() => setIsOpen(false)}>企業情報</Link>
          <a href="#contact" onClick={() => setIsOpen(false)}>お問い合わせ</a>
        </nav>
      )}
    </header>
  );
}