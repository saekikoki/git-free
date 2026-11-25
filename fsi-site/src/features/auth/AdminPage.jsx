/**
 * 管理者パネルページ
 *
 * このページは管理者（adminロール）専用の画面で、ニュースの投稿と削除ができます。
 * URL: /admin
 *
 * 管理者でないユーザーがアクセスした場合は /login にリダイレクトされます。
 * 主な機能:
 *   - ニュースの一覧表示
 *   - ニュースの新規投稿（タイトル・カテゴリ・本文）
 *   - ニュースの削除
 *   - ログアウト
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import PageHead from "../../components/layout/PageHead";

export default function Admin() {
  const { user, isAdmin, logout } = useAuth(); // 認証情報を取得（ユーザー情報、管理者判定、ログアウト関数）
  const navigate = useNavigate();              // ページ遷移用フック

  // --- state変数 ---
  const [news, setNews] = useState([]);        // APIから取得したニュース記事の一覧
  const [title, setTitle] = useState("");      // 投稿フォーム: タイトル入力値
  const [category, setCategory] = useState(""); // 投稿フォーム: カテゴリ入力値
  const [content, setContent] = useState("");  // 投稿フォーム: 本文入力値
  const [status, setStatus] = useState("");    // 操作結果メッセージ（成功/エラー）

  /**
   * useEffect: 管理者権限チェック
   * ページ表示時にuser/isAdminを確認し、管理者でなければログインページへリダイレクト。
   * user, isAdmin, navigateが変わるたびに再実行される。
   */
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
    }
  }, [user, isAdmin, navigate]);

  /**
   * ニュース一覧をAPIから取得する関数
   * GET /api/news を呼び出し、成功時にnews stateを更新する。
   */
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news"); // GET /api/news: ニュース一覧取得
      if (res.ok) {
        const data = await res.json();
        setNews(data); // 取得したデータでnews一覧を更新
      }
    } catch (err) {
      console.error("ニュース取得エラー:", err);
    }
  };

  /**
   * useEffect: ニュース一覧の初回読み込み
   * コンポーネントがマウントされた時（初回表示時）にニュース一覧を取得する。
   */
  useEffect(() => {
    fetchNews();
  }, []);

  /**
   * ニュース投稿フォームの送信処理
   * POST /api/news にタイトル・カテゴリ・本文をJSON送信する。
   * 成功時: フォームをリセットし、ニュース一覧を再取得。
   * 失敗時: エラーメッセージを表示。
   */
  const handlePost = async (e) => {
    e.preventDefault(); // ブラウザのデフォルト送信動作を止める
    setStatus("");

    // バリデーション: タイトルが空なら送信しない
    if (!title.trim()) {
      setStatus("タイトルを入力してください");
      return;
    }

    try {
      // POST /api/news: ニュースを新規投稿（認証トークン付き）
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 認証用トークンをヘッダーに付与
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) throw new Error("投稿に失敗しました");

      // 成功時: フォームをクリアして一覧を再取得
      setStatus("投稿しました");
      setTitle("");
      setCategory("");
      setContent("");
      fetchNews();
    } catch (err) {
      // 失敗時: エラーメッセージをstatusに設定
      setStatus(err.message);
    }
  };

  /**
   * ニュース削除処理
   * DELETE /api/news/:sk を呼び出して指定ニュースを削除する。
   * 確認ダイアログでOKした場合のみ実行。
   * 成功時: ニュース一覧を再取得。
   * 失敗時: エラーメッセージを表示。
   */
  const handleDelete = async (sk) => {
    if (!window.confirm("このニュースを削除しますか？")) return; // 確認ダイアログ

    try {
      // DELETE /api/news/:sk: 指定ニュースを削除（認証トークン付き）
      const res = await fetch(`/api/news/${sk}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("削除に失敗しました");

      setStatus("削除しました");
      fetchNews(); // 一覧を再取得して画面を更新
    } catch (err) {
      setStatus(err.message);
    }
  };

  /**
   * ログアウトボタンの処理
   * AuthContextのlogout()を呼び、トップページに遷移する。
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 管理者でない場合は何も表示しない（useEffectでリダイレクト処理中）
  if (!user || !isAdmin) return null;

  return (
    <section className="admin-section">
      <PageHead title="管理者パネル" description="ニュースの投稿・削除を行う管理者用ページです。" />
      <div className="admin-header">
        <h2>管理者パネル</h2>
        <div className="admin-user-info">
          <span>{user.email}</span>
          <button onClick={handleLogout} className="btn-logout">ログアウト</button>
        </div>
      </div>

      {/* ニュース投稿フォーム */}
      <div className="admin-card">
        <h3>ニュース投稿</h3>
        <form onSubmit={handlePost} className="admin-form">
          <label>
            タイトル
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ニュースタイトル"
              required
            />
          </label>

          <label>
            カテゴリ
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="例: お知らせ、製品、組織"
            />
          </label>

          <label>
            本文
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ニュース本文"
              rows="5"
            />
          </label>

          <button type="submit">投稿する</button>
        </form>
        {/* 操作結果メッセージがあれば表示 */}
        {status && <p className="admin-status">{status}</p>}
      </div>

      {/* ニュース一覧・削除セクション */}
      <div className="admin-card">
        <h3>ニュース一覧</h3>
        {/* ニュースが0件のとき「まだありません」を表示、あればリスト表示 */}
        {news.length === 0 ? (
          <p className="admin-empty">ニュースはまだありません</p>
        ) : (
          <ul className="admin-news-list">
            {news.map((n) => (
              <li key={n.SK} className="admin-news-item">
                <div className="admin-news-info">
                  <time>{new Date(n.publishedAt).toLocaleDateString("ja-JP")}</time>
                  {n.category && <span className="admin-badge">{n.category}</span>}
                  <span className="admin-news-title">{n.title}</span>
                </div>
                <button
                  onClick={() => handleDelete(n.SK)}
                  className="btn-delete"
                  aria-label={`${n.title}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
