/**
 * ChatPage.jsx - リアルタイムチャット（ビジネスチャット風）
 * URL: /chat
 *
 * 機能:
 *   - WebSocketによる即時送受信、自動再接続
 *   - 名前設定（localStorageに保存）、自分/他人でバブル左右振り分け
 *   - アバター（イニシャル・名前ごとに色分け）、連続投稿のグルーピング
 *   - 入力中インジケーター、絵文字リアクション
 *   - オンライン参加者アバター表示
 *   - Enterで送信 / Shift+Enterで改行
 */
import { useState, useEffect, useRef, useCallback } from "react";
import PageHead from "../../components/layout/PageHead";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "👀"];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}
// 名前から一貫した色を生成（アバター用）
function colorFromName(name) {
  const palette = ["#0b3c5d", "#2bb0d6", "#7d3c98", "#1a7a8c", "#c0392b", "#e67e22", "#27ae60", "#2874a6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState(() => localStorage.getItem("chat_name") || "");
  const [nameConfirmed, setNameConfirmed] = useState(() => !!localStorage.getItem("chat_name"));
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const wsRef = useRef(null);
  const endRef = useRef(null);
  const reconnectRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastTypingSentRef = useRef(0);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.hostname}:3001/ws/chat`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) { clearTimeout(reconnectRef.current); reconnectRef.current = null; }
      // 名前が決まっていれば参加通知
      const savedName = localStorage.getItem("chat_name");
      if (savedName) ws.send(JSON.stringify({ type: "join", name: savedName }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "history":
            setMessages(data.messages || []);
            break;
          case "chat":
            setMessages((prev) => [...prev, data.message]);
            break;
          case "online":
            setUsers(data.users || []);
            break;
          case "reaction":
            setMessages((prev) => prev.map((m) => m.id === data.messageId ? { ...m, reactions: data.reactions } : m));
            break;
          case "typing":
            setTypingUser(data.name);
            clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => setTypingUser(""), 2500);
            break;
        }
      } catch (err) {
        console.error("[Chat] parse error", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectRef.current = setTimeout(connect, 3000);
    };
    ws.onerror = () => {};
    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connect]);

  // 新着で最下部へスクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // 名前確定
  const confirmName = (e) => {
    e.preventDefault();
    const n = name.trim() || "匿名";
    localStorage.setItem("chat_name", n);
    setName(n);
    setNameConfirmed(true);
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({ type: "join", name: n }));
    }
  };

  // 入力中を通知（1秒に1回まで）
  const notifyTyping = () => {
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1000 && wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
      lastTypingSentRef.current = now;
    }
  };

  // 送信
  const send = () => {
    if (!input.trim() || wsRef.current?.readyState !== 1) return;
    wsRef.current.send(JSON.stringify({ type: "chat", name, message: input.trim() }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const react = (messageId, emoji) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({ type: "reaction", messageId, emoji }));
    }
  };

  // --- 名前未設定なら名前入力画面 ---
  if (!nameConfirmed) {
    return (
      <section className="chatx-gate">
        <PageHead title="チャット" description="リアルタイムチャットでメンバーと交流。" />
        <div className="chatx-gate-card">
          <div className="chatx-gate-icon">💬</div>
          <h2>チャットに参加</h2>
          <p>表示名を入力してください</p>
          <form onSubmit={confirmName}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前（例: 山田）"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="btn btn-primary">参加する</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="chatx">
      <PageHead title="チャット" description="リアルタイムチャットでメンバーと交流。" />

      <div className="chatx-window">
        {/* ヘッダー */}
        <header className="chatx-header">
          <div className="chatx-header-title">
            <span className="chatx-hash">#</span> general
          </div>
          <div className="chatx-presence">
            <span className={`chatx-dot ${connected ? "on" : "off"}`}></span>
            <div className="chatx-avatars">
              {users.slice(0, 5).map((u, i) => (
                <span key={i} className="chatx-avatar chatx-avatar-sm" style={{ background: colorFromName(u) }} title={u}>
                  {u.charAt(0)}
                </span>
              ))}
            </div>
            <span className="chatx-count">{users.length}人</span>
          </div>
        </header>

        {/* メッセージ */}
        <div className="chatx-body">
          {messages.length === 0 ? (
            <p className="chatx-empty">まだメッセージはありません。<br />最初の発言をしてみましょう 👋</p>
          ) : (
            messages.map((msg, i) => {
              const prev = messages[i - 1];
              const isMine = msg.name === name;
              const showDate = i === 0 || formatDate(msg.timestamp) !== formatDate(prev.timestamp);
              // 直前が同じ人・同じ日付なら名前とアバターを省略（グルーピング）
              const grouped = prev && prev.name === msg.name && !showDate;

              return (
                <div key={msg.id}>
                  {showDate && <div className="chatx-datesep"><span>{formatDate(msg.timestamp)}</span></div>}
                  <div className={`chatx-row ${isMine ? "mine" : ""} ${grouped ? "grouped" : ""}`}>
                    {!isMine && (
                      <div className="chatx-avatar-col">
                        {!grouped && (
                          <span className="chatx-avatar" style={{ background: colorFromName(msg.name) }}>
                            {msg.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="chatx-msg-col">
                      {!grouped && (
                        <div className="chatx-msg-meta">
                          {!isMine && <span className="chatx-msg-name">{msg.name}</span>}
                          <span className="chatx-msg-time">{formatTime(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className="chatx-bubble">
                        {msg.message.split("\n").map((line, li) => <span key={li}>{line}<br /></span>)}
                        {/* リアクションピッカー */}
                        <div className="chatx-react-picker">
                          {REACTION_EMOJIS.map((emo) => (
                            <button key={emo} onClick={() => react(msg.id, emo)} aria-label={`${emo}でリアクション`}>{emo}</button>
                          ))}
                        </div>
                      </div>
                      {/* 付いたリアクション */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="chatx-reactions">
                          {Object.entries(msg.reactions).map(([emo, cnt]) => (
                            <button key={emo} className="chatx-reaction" onClick={() => react(msg.id, emo)}>
                              {emo} {cnt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* 入力中インジケーター */}
          {typingUser && typingUser !== name && (
            <div className="chatx-typing">
              <span className="chatx-typing-dots"><span></span><span></span><span></span></span>
              {typingUser} さんが入力中…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* 入力エリア */}
        <div className="chatx-input">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); notifyTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "メッセージを入力（Enterで送信 / Shift+Enterで改行）" : "接続中..."}
            rows={1}
            maxLength={1000}
            disabled={!connected}
          />
          <button className="chatx-send" onClick={send} disabled={!connected || !input.trim()} aria-label="送信">
            ➤
          </button>
        </div>
      </div>
    </section>
  );
}
