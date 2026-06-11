import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="col logo-col">
            <h2 className="brand">FUJISOFT</h2>
            {/* 必要ならロゴ画像 */}
          </div>
          <nav className="col">
            <h3>IT×OT×AIで導く</h3>
            <ul>
              <li><Link to="/page1">事業紹介</Link></li>
              <li><a href="#">強み</a></li>
              <li><a href="#">あゆみ</a></li>
              <li><a href="#">中長期の成長ストーリー</a></li>
            </ul>
          </nav>

          <nav className="col">
            <h3>製品・サービス</h3>
            <ul>
              <li><a href="#">導入事例</a></li>
              <li><Link to="/page1">会社情報</Link></li>
              <li><a href="#">トップメッセージ</a></li>
            </ul>
          </nav>

          <nav className="col">
            <h3>サステナビリティ</h3>
            <ul>
              <li><a href="#">トップメッセージ</a></li>
              <li><a href="#">環境</a></li>
              <li><a href="#">社会</a></li>
            </ul>
          </nav>

          <nav className="col">
            <h3>イベント・セミナー</h3>
            <ul>
              <li><a href="#">ニュースリリース</a></li>
              <li><Link to="/entry">採用情報</Link></li>
              <li><a href="#">お問い合わせ</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-container">
          <div className="bottom-links">
            <a href="#">個人情報保護への取り組み</a>
            <a href="#">サイトのご利用について</a>
            <a href="#">サイトマップ</a>
          </div>

          <div className="social">
            {/* SVGアイコンをインラインで入れるか画像を置く */}
            <a href="#" aria-label="facebook" className="icon">F</a>
            <a href="#" aria-label="twitter" className="icon">X</a>
            <a href="#" aria-label="linkedin" className="icon">in</a>
          </div>
        </div>

        <div className="copyright">© FUJISOFT INCORPORATED</div>
      </div>
    </footer>
  );
}