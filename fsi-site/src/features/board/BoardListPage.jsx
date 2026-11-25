/**
 * 掲示板（スレッド一覧）ページ
 *
 * このページは社内掲示板のスレッド一覧を表示し、新規スレッドを作成できます。
 * URL: /board
 *
 * 主な機能:
 *   - スレッド一覧の表示（テーブル形式）
 *   - スレッドのキーワード検索（フロントエンドでフィルタリング）
 *   - 新規スレッド作成フォーム（タイトル・名前・本文）
 *   - 管理者のみスレッド削除が可能
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageHead from "../../components/layout/PageHead";

/**
 * 日付を「MM/DD HH:mm」形式にフォーマットするヘルパー関数
 */
function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Board() {
  // --- state変数 ---
  const [threads, setThreads] = useState([]);       // APIから取得したスレッド一覧
  const [searchQuery, setSearchQuery] = useState(""); // 検索バーの入力値
  const [title, setTitle] = useState("");           // 新規スレッドフォーム: タイトル
  const [name, setName] = useState("");             // 新規スレッドフォーム: 投稿者名（空なら匿名）
  const [message, setMessage] = useState("");       // 新規スレッドフォーム: 本文（>>1になる）
  const [showForm, setShowForm] = useState(false);  // 新規スレッドフォームの表示/非表示
  const [status, setStatus] = useState("");         // フォーム操作の結果メッセージ
  const { user, isAdmin } = useAuth();              // 認証情報（管理者判定に使用）

  /**
   * スレッド一覧をAPIから取得する関数
   * GET /api/board を呼び出し、成功時にthreads stateを更新する。
   */
  const fetchThreads = async () => {
    try {
      const res = await fetch("/api/board"); // GET /api/board: スレッド一覧を取得
      if (res.ok) setThreads(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * useEffect: スレッド一覧の初回読み込み
   * コンポーネントがマウントされた時（画面初回表示時）にスレッド一覧を取得する。
   */
  useEffect(() => {
    fetchThreads();
  }, []);

  /**
   * 新規スレッド作成フォームの送信処理
   * POST /api/board にタイトル・名前・本文をJSON送信する。
   * 成功時: フォームをリセットし、スレッド一覧を再取得。
   * 失敗時: エラーメッセージを表示。
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // ブラウザのデフォルト送信動作を止める
    setStatus("");

    // バリデーション: タイトルと本文は必須
    if (!title.trim()) { setStatus("スレッドタイトルを入力してください"); return; }
    if (!message.trim()) { setStatus("本文を入力してください"); return; }

    try {
      // POST /api/board: 新規スレッド作成
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "スレッド作成に失敗");
      }
      // 成功時: フォームをクリアし、フォームを閉じて一覧を再取得
      setTitle("");
      setName("");
      setMessage("");
      setShowForm(false);
      fetchThreads();
    } catch (err) {
      setStatus(err.message);
    }
  };

  /**
   * スレッド削除処理（管理者のみ使用可能）
   * DELETE /api/board/:threadId を呼び出してスレッドごと削除する。
   * 確認ダイアログでOKした場合のみ実行。
   */
  const handleDeleteThread = async (threadId) => {
    if (!window.confirm("このスレッドを削除しますか？（全レスが削除されます）")) return;
    try {
      // DELETE /api/board/:threadId: スレッドを削除（認証トークン付き）
      const res = await fetch(`/api/board/${threadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "削除に失敗");
      }
      fetchThreads(); // 一覧を再取得して画面を更新
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="bbs">
      <PageHead title="掲示板" description="FSI-STYLE CORP社内掲示板。誰でもスレッドを立てて書き込めます。" />
      <div className="bbs-header">
        <h2 className="bbs-title">掲示板</h2>
        {/* 新規スレッド作成フォームの表示/非表示を切り替えるボタン */}
        <button className="bbs-new-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "閉じる" : "新規スレッド作成"}
        </button>
      </div>

      {/* showFormがtrueのときだけ新規スレッド作成フォームを表示 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bbs-new-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="スレッドタイトル"
            maxLength={100}
            required
            className="bbs-input"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前（空欄で匿名）"
            maxLength={30}
            className="bbs-input bbs-input-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="本文（>>1 になります）"
            rows="3"
            required
            maxLength={1000}
            className="bbs-textarea"
          />
          <div className="bbs-form-actions">
            <button type="submit" className="bbs-submit">スレッドを立てる</button>
          </div>
          {/* ステータスメッセージがあれば表示 */}
          {status && <p className="bbs-status">{status}</p>}
        </form>
      )}

      {/* 検索バー: 入力した文字でスレッドタイトルをフィルタリング */}
      <div className="bbs-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="スレッドを検索..."
          className="bbs-search-input"
        />
        {/* 検索語があるときだけクリアボタンを表示 */}
        {searchQuery && (
          <button className="bbs-search-clear" onClick={() => setSearchQuery("")} aria-label="検索クリア">×</button>
        )}
      </div>

      {/* スレッド一覧テーブル */}
      <table className="bbs-table">
        <thead>
          <tr>
            <th className="bbs-col-num">#</th>
            <th className="bbs-col-title">スレッドタイトル</th>
            <th className="bbs-col-res">レス</th>
            <th className="bbs-col-date">最終投稿</th>
            {/* 管理者のみ「操作」列を表示 */}
            {isAdmin && <th className="bbs-col-action">操作</th>}
          </tr>
        </thead>
        <tbody>
          {(() => {
            // 検索クエリでスレッドをフィルタリング（大文字小文字区別なし）
            const q = searchQuery.trim().toLowerCase();
            const filtered = q
              ? threads.filter((t) => t.title.toLowerCase().includes(q))
              : threads;

            // フィルタ結果が0件のとき: 空状態メッセージを表示
            if (filtered.length === 0) {
              return (
                <tr><td colSpan={isAdmin ? 5 : 4} className="bbs-empty">
                  {q ? "該当するスレッドが見つかりません" : "スレッドはまだありません"}
                </td></tr>
              );
            }

            // スレッド一覧を1行ずつ表示
            return filtered.map((t, i) => (
              <tr key={t.id}>
                <td className="bbs-col-num">{i + 1}</td>
                <td className="bbs-col-title">
                  <Link to={`/board/${t.id}`} className="bbs-thread-link">{t.title}</Link>
                </td>
                <td className="bbs-col-res">{t.resCount}</td>
                <td className="bbs-col-date">{formatDate(t.lastResAt)}</td>
                {/* 管理者のみ削除ボタンを表示 */}
                {isAdmin && (
                  <td className="bbs-col-action">
                    <button className="bbs-delete-btn" onClick={() => handleDeleteThread(t.id)}>削除</button>
                  </td>
                )}
              </tr>
            ));
          })()}
        </tbody>
      </table>
    </section>
  );
}
