import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageHead from "../../components/layout/PageHead";

function formatDateTime(d) {
  const dt = new Date(d);
  return dt.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function BoardThread() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const bottomRef = useRef(null);

  const fetchThread = async () => {
    try {
      const res = await fetch(`/api/board/${id}`);
      if (!res.ok) throw new Error("スレッドが見つかりません");
      setThread(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setPosting(true);

    try {
      const res = await fetch(`/api/board/${id}/res`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "書き込みに失敗");
      }
      setMessage("");
      await fetchThread();
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteRes = async (num) => {
    if (!window.confirm(`レス >>${num} を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/board/${id}/res/${num}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "削除に失敗");
      }
      fetchThread();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteThread = async () => {
    if (!window.confirm("このスレッドを削除しますか？（全レスが削除されます）")) return;
    try {
      const res = await fetch(`/api/board/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "削除に失敗");
      }
      // スレッド一覧に戻る
      window.location.href = "/board";
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) {
    return (
      <section className="bbs">
        <p className="bbs-error">{error}</p>
        <Link to="/board" className="bbs-back">スレッド一覧に戻る</Link>
      </section>
    );
  }

  if (!thread) {
    return <section className="bbs"><p className="bbs-loading">読み込み中...</p></section>;
  }

  return (
    <section className="bbs">
      <PageHead title={thread.title} description={`掲示板スレッド: ${thread.title}`} />
      <Link to="/board" className="bbs-back">&larr; スレッド一覧</Link>

      <div className="bbs-thread-header">
        <h2 className="bbs-thread-title">{thread.title}</h2>
        {isAdmin && (
          <button className="bbs-delete-btn" onClick={handleDeleteThread}>スレッド削除</button>
        )}
      </div>
      <p className="bbs-thread-meta">{thread.responses.length} レス</p>

      {/* レス一覧 */}
      <div className="bbs-responses">
        {thread.responses.map((r) => (
          <div key={r.num} className="bbs-res" id={`res-${r.num}`}>
            <div className="bbs-res-header">
              <span className="bbs-res-num">{r.num}</span>
              <span className="bbs-res-name">{r.name}</span>
              <span className="bbs-res-date">{formatDateTime(r.createdAt)}</span>
              {isAdmin && r.name !== "削除済み" && (
                <button
                  className="bbs-res-delete"
                  onClick={() => handleDeleteRes(r.num)}
                  aria-label={`レス${r.num}を削除`}
                >
                  削除
                </button>
              )}
            </div>
            <div className="bbs-res-body">
              {r.message.split("\n").map((line, i) => (
                <span key={i}>
                  {line.startsWith(">>") ? (
                    <span className="bbs-res-anchor">{line}</span>
                  ) : (
                    line
                  )}
                  {i < r.message.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 書き込みフォーム */}
      <form onSubmit={handleSubmit} className="bbs-write-form">
        <div className="bbs-write-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前（空欄で匿名）"
            maxLength={30}
            className="bbs-write-name"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="書き込み内容"
          rows="3"
          required
          maxLength={1000}
          className="bbs-write-message"
        />
        <button type="submit" disabled={posting} className="bbs-write-submit">
          {posting ? "書き込み中..." : "書き込む"}
        </button>
      </form>
    </section>
  );
}
