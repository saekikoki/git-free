/**
 * AuthNavLinks.jsx - ヘッダーのログイン/ログアウト/管理リンク（フル版のみ）
 *
 * フル版の config.js から HeaderExtra として渡され、Header の右端に表示される。
 * onNavigate: リンクを押したときに呼ぶ関数（モバイルメニューを閉じる用）
 */
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AuthNavLinks({ onNavigate }) {
  const { user, isAdmin, logout } = useAuth();

  if (!user) {
    return <Link to="/login" onClick={onNavigate}>ログイン</Link>;
  }

  return (
    <>
      {isAdmin && <Link to="/admin" onClick={onNavigate}>管理</Link>}
      <button
        className="nav-logout-btn"
        onClick={() => { logout(); onNavigate?.(); }}
      >
        ログアウト
      </button>
    </>
  );
}
