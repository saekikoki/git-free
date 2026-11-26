/**
 * Header.jsx - サイト共通のヘッダー（ナビゲーション）コンポーネント
 *
 * 機能:
 * - ロゴ（クリックでトップページへ）
 * - PC用ナビゲーション（768px以上で表示）
 * - モバイル用ハンバーガーメニュー（768px以下で表示）
 * - ナビのリンクはエディションごとの config.js（headerNav）から取得
 * - フル版のみ、右端にログイン/ログアウト/管理リンク（HeaderExtra）を表示
 * - アクセシビリティ対応（フォーカストラップ、Escキー、aria属性）
 */
import { useState, useEffect, useRef } from "react";
import Link from "../../i18n/LocalizedLink";   // 言語に合わせてリンク先を変える <Link>
import { useLang } from "../../i18n/lang";
import { useContent } from "../../content";
import profile from "../../content/company-profile";
import { headerNav, HeaderExtra } from "@edition/config"; // エディションごとのナビ設定

export default function Header() {
  const lang = useLang();
  const all = useContent();
  const t = all.common.header;
  // 英語ページでは labelEn（なければ label）を表示する
  const labelOf = (item) => (lang === "en" && item.labelEn) || item.label;

  // isOpen: モバイルメニューが開いているかどうか
  const [isOpen, setIsOpen] = useState(false);

  // scrolled: ページを少しスクロールしたか（ヘッダーの見た目を変える）
  const [scrolled, setScrolled] = useState(false);

  // menuRef: モバイルメニューのDOM参照（フォーカストラップに使用）
  const menuRef = useRef(null);

  // メニューを閉じるヘルパー関数
  const closeMenu = () => setIsOpen(false);

  // スクロール量を監視して、20px以上でヘッダーを凝縮スタイルに切り替える
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * アクセシビリティ: Escキーでメニューを閉じる＋フォーカストラップ
   * フォーカストラップ = メニュー内でTabキーを押したとき、
   * メニュー外にフォーカスが逃げないようにする仕組み
   */
  useEffect(() => {
    if (!isOpen) return; // メニューが閉じているときは何もしない

    const handleKeyDown = (e) => {
      // Escキーでメニューを閉じる
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Tabキーでのフォーカストラップ処理
      if (e.key === "Tab" && menuRef.current) {
        // メニュー内のフォーカス可能な要素を全て取得
        const focusable = menuRef.current.querySelectorAll("a, button");
        if (focusable.length === 0) return;

        const first = focusable[0];              // 最初の要素
        const last = focusable[focusable.length - 1]; // 最後の要素

        // Shift+Tab: 最初の要素にいたら最後に戻る
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        // Tab: 最後の要素にいたら最初に戻る
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown); // クリーンアップ
  }, [isOpen]);

  // メニューが開いたら最初のリンクに自動フォーカス（キーボード操作のため）
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }
  }, [isOpen]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      {/* キーボード操作の人が、メニューを飛ばして本文へ移れるリンク（Tab で最初に出る） */}
      <a className="skip-link" href="#main">{all.common.skipToContent}</a>
      {/* ロゴ: クリックでトップページへ遷移 */}
      {/* 見出し（h1）はページごとに1つだけにするため、ロゴは見出しにしない */}
      <div className="logo">
        <Link to="/">
          {profile.brand.main} <span className="logo-accent">{profile.brand.accent}</span>
        </Link>
      </div>

      {/* PC用ナビゲーション（768px以上で表示、モバイルではCSSで非表示） */}
      <nav className="pc-nav" aria-label={t.mainNav}>
        {headerNav.map((item) => (
          <Link key={item.to} to={item.to}>{labelOf(item)}</Link>
        ))}
        {HeaderExtra && <HeaderExtra />}
      </nav>

      {/* ハンバーガーボタン（モバイルのみ表示） */}
      <button
        className="menu-button"
        aria-label={t.menu}
        aria-expanded={isOpen}         // メニューが開いているか
        aria-controls="mobile-nav"     // 制御対象のID
        onClick={() => setIsOpen(!isOpen)} // 押すたびに開閉切り替え
      >
        {isOpen ? "×" : "☰"}
      </button>

      {/* モバイルメニュー（開閉はCSSクラスで制御） */}
      <nav
        id="mobile-nav"
        className={`mobile-nav ${isOpen ? "mobile-nav-open" : ""}`}
        aria-label={t.mobileNav}
        aria-hidden={!isOpen}  // 閉じているときはスクリーンリーダーから非表示
        ref={menuRef}          // フォーカストラップ用の参照
      >
        {headerNav.map((item) => (
          <Link key={item.to} to={item.to} onClick={closeMenu}>{labelOf(item)}</Link>
        ))}
        {HeaderExtra && <HeaderExtra onNavigate={closeMenu} />}
      </nav>
    </header>
  );
}
