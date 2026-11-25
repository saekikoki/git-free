/**
 * ログインページ
 *
 * このページは管理者がメールアドレスとパスワードでログインするためのフォームを表示します。
 * URL: /login
 *
 * ログイン成功時:
 *   - 管理者(admin)ロール → /admin に遷移
 *   - それ以外 → / (トップページ) に遷移
 * ログイン失敗時: エラーメッセージを画面に表示
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import PageHead from "../../components/layout/PageHead";

export default function Login() {
  // --- state変数 ---
  const [email, setEmail] = useState("");         // 入力中のメールアドレス
  const [password, setPassword] = useState("");   // 入力中のパスワード
  const [error, setError] = useState("");         // エラーメッセージの表示内容
  const [loading, setLoading] = useState(false);  // ログイン処理中かどうかのフラグ
  const { login } = useAuth();                    // AuthContextからログイン関数を取得
  const navigate = useNavigate();                 // ページ遷移に使うフック

  /**
   * フォーム送信時の処理
   * 1. 入力チェック（空欄がないか）
   * 2. AuthContextのlogin関数でAPI認証を実行
   * 3. 成功時 → ロールに応じてページ遷移
   * 4. 失敗時 → エラーメッセージを表示
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // ブラウザのデフォルト送信動作を止める
    setError("");

    // バリデーション: メールアドレスかパスワードが空なら送信しない
    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true); // ローディング状態にする
    try {
      // AuthContextのlogin関数を呼び出し（内部でAPIにfetchしている）
      const userData = await login(email.trim(), password);

      // ログイン成功後、ロールに応じてリダイレクト先を決定
      if (userData.role === "admin") {
        navigate("/admin");   // 管理者は管理画面へ
      } else {
        navigate("/");        // 一般ユーザーはトップページへ
      }
    } catch (err) {
      // ログイン失敗時: エラーメッセージを画面に表示
      setError(err.message);
    } finally {
      setLoading(false); // 処理完了後、ローディング解除
    }
  };

  return (
    <section className="login-section">
      <PageHead title="ログイン" description="FSI-STYLE CORP管理画面へのログインページです。" />
      <div className="login-card">
        <h2>ログイン</h2>

        {/* エラーがあるときだけエラーメッセージを表示 */}
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@fsi.co.jp"
              autoComplete="email"
              required
            />
          </label>

          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              autoComplete="current-password"
              required
            />
          </label>

          {/* ローディング中はボタンを無効化し、テキストを変える */}
          <button type="submit" disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </section>
  );
}
