import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">

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