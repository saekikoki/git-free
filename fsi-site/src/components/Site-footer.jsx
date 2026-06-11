import React, { useEffect, useRef, useState } from 'react';

/*
  スマート化ポイント：
  - コンポーネント分割（簡易）
  - メニューは条件レンダリング or class 切替で表示
  - body スクロールロック
  - Esc とクリックアウトで閉じる
  - サブメニューはアクティブなものだけレンダリング
*/

function useLockBody(lock) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (lock) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [lock]);
}

function NavToggle({ open, onToggle }) {
  return (
    <button
      aria-label="メニュー"
      aria-expanded={open}
      className="nav-toggle"
      onClick={onToggle}
    >
      <span className={`navicon ${open ? 'is-open' : ''}`} />
    </button>
  );
}

function SearchToggle({ open, onToggle }) {
  return (
    <button
      aria-label="サイト内検索"
      aria-expanded={open}
      className="search-toggle"
      onClick={onToggle}
    >
      <span className="icon-search" />
    </button>
  );
}

function Subnav({ id, title, items, onClose }) {
  // サブメニューは表示時にのみレンダリング
  return (
    <div className="subnav" role="dialog" aria-labelledby={id}>
      <div className="subnav-head">
        <button onClick={onClose} aria-label="戻る" className="back-button">戻る</button>
        <h3 id={id}>{title}</h3>
      </div>
      <ul className="subnav-list">
        {items.map((it) => (
          <li key={it.href}><a href={it.href}>{it.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSub, setActiveSub] = useState(null); // e.g. 'products'
  const navRef = useRef(null);

  // body のスクロールをロック
  useLockBody(navOpen);

  // Esc キーで閉じる & クリックアウトで閉じる
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setNavOpen(false);
        setActiveSub(null);
        setSearchOpen(false);
      }
    }
    function onClick(e) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) {
        // nav の外をクリックしたら閉じる（必要なら対象を限定）
        setNavOpen(false);
        setActiveSub(null);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // サブメニューデータ（例）
  const SUBS = {
    products: {
      title: '製品・サービス',
      items: [
        { href: '/it_strategy/index.html', label: 'IT戦略/DX推進' },
        { href: '/system_development/index.html', label: '開発体制強化/効率化' },
        // 必要な項目を追加
      ],
    },
    company: {
      title: '会社情報',
      items: [
        { href: '/company/about.html', label: '会社概要' },
        { href: '/company/message.html', label: 'トップメッセージ' },
      ],
    },
  };

  // メニューを開くときはサブメニューを初期化
  const toggleNav = () => {
    setNavOpen((s) => {
      if (s) {
        setActiveSub(null);
      }
      return !s;
    });
  };

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">本文へ</a>

      <div className="header-inner">
        <div className="logo"><a href="/"><img src="/common/img/logo.svg" alt="サイトロゴ" /></a></div>

        <div className="header-actions">
          <SearchToggle open={searchOpen} onToggle={() => setSearchOpen((s) => !s)} />
          <NavToggle open={navOpen} onToggle={toggleNav} />
        </div>
      </div>

      {/* 検索は必要に応じて条件レンダリング */}
      {searchOpen && (
        <div className="search-panel">
          <form className="search-form" role="search">
            <input name="q" placeholder="サイト内検索" />
            <button type="submit">検索</button>
          </form>
        </div>
      )}

      {/* ナビは open のときだけレンダリング（必要があれば class 切替でトランジション） */}
      {navOpen && (
        <div className="nav-overlay" aria-hidden={!navOpen}>
          <nav className="nav-main" ref={navRef} aria-label="メインメニュー">
            <ul className="nav-list">
              <li>
                <a href="/special.html">IT×OT×AIで導く</a>
              </li>

              <li>
                <button
                  className="nav-item-btn"
                  onClick={() => setActiveSub((s) => (s === 'products' ? null : 'products'))}
                  aria-expanded={activeSub === 'products'}
                  aria-controls="sub-products"
                >
                  製品・サービス
                </button>

                {/* サブをアクティブなときだけレンダリング */}
                {activeSub === 'products' && (
                  <Subnav
                    id="sub-products"
                    title={SUBS.products.title}
                    items={SUBS.products.items}
                    onClose={() => setActiveSub(null)}
                  />
                )}
              </li>

              <li><a href="/cases/">導入事例</a></li>

              <li>
                <button
                  className="nav-item-btn"
                  onClick={() => setActiveSub((s) => (s === 'company' ? null : 'company'))}
                  aria-expanded={activeSub === 'company'}
                  aria-controls="sub-company"
                >
                  会社情報
                </button>

                {activeSub === 'company' && (
                  <Subnav
                    id="sub-company"
                    title={SUBS.company.title}
                    items={SUBS.company.items}
                    onClose={() => setActiveSub(null)}
                  />
                )}
              </li>

              <li><a href="/sustainability/">サステナビリティ</a></li>
            </ul>

            <div className="nav-footer">
              <a href="/contact/aboutus.html">お問い合わせ</a>
              <a href="https://www.fsi.co.jp/recruit/" target="_blank" rel="noopener noreferrer">採用情報</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}