/**
 * ============================================================
 * FSIサイト ローカル開発用APIサーバー
 * ============================================================
 *
 * このファイルは、フロントエンド開発時に使うモック（ダミー）APIサーバーです。
 * Express.jsを使って、ログイン・ニュース管理・お問い合わせ・掲示板の
 * APIエンドポイントを提供します。
 *
 * データはすべてメモリ上に保持されるため、サーバーを再起動すると
 * 追加・変更したデータはリセットされます。
 *
 * 起動方法: npm run server（= node backend/local-server/index.js）
 * ポート: 3001 (http://localhost:3001)
 * ============================================================
 */

// --- ライブラリの読み込み ---
import express from "express"; // Webサーバーフレームワーク
import cors from "cors"; // クロスオリジン（別ポートからのアクセス）を許可するミドルウェア

// --- Expressアプリケーションの初期化 ---
const app = express();
const PORT = 3001; // サーバーが待ち受けるポート番号

// --- ミドルウェアの設定 ---
app.use(cors()); // フロントエンド（別ポート）からのリクエストを許可する
app.use(express.json()); // リクエストのボディをJSON形式として解析する

// ============================================================
// ダミーデータ定義
// ============================================================

/**
 * ダミーユーザーデータ
 * ログイン認証に使われるユーザー情報の一覧
 * - email: ログイン用メールアドレス
 * - password: ログイン用パスワード
 * - role: 権限（"admin" = 管理者, "user" = 一般ユーザー）
 */
const users = [
  { email: "admin@fsi.co.jp", password: "password", role: "admin" },
  { email: "user@fsi.co.jp", password: "password", role: "user" },
];

/**
 * ニュースデータ（メモリ内で管理）
 * - SK: ニュースの一意なID（ソートキー）
 * - title: ニュースのタイトル
 * - category: カテゴリー（例: "お知らせ", "組織"）
 * - content: ニュース本文
 * - publishedAt: 公開日時（ISO8601形式）
 */
let newsItems = [
  {
    SK: "news-001",
    title: "新サービスをリリースしました",
    category: "お知らせ",
    content: "新しいクラウドサービスの提供を開始しました。",
    publishedAt: "2025-06-01T09:00:00Z",
  },
  {
    SK: "news-002",
    title: "オフィス移転のお知らせ",
    category: "組織",
    content: "本社オフィスを移転いたします。",
    publishedAt: "2025-05-15T09:00:00Z",
  },
];

// ============================================================
// 認証関連 API
// ============================================================

/**
 * ログインAPI
 * メールアドレスとパスワードで認証し、成功したらトークンを返す
 *
 * リクエスト: { email: "xxx@xxx.co.jp", password: "xxx" }
 * 成功レスポンス: { email, role, token }
 * 失敗レスポンス: 400（入力不足）または 401（認証失敗）
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body; // リクエストからメールとパスワードを取得

  // 入力値のバリデーション（必須チェック）
  if (!email || !password) {
    return res.status(400).json({ message: "メールアドレスとパスワードを入力してください" });
  }

  // ユーザー一覧からメールとパスワードが一致するユーザーを探す
  const user = users.find((u) => u.email === email && u.password === password);

  // 一致するユーザーがいなければ認証エラー
  if (!user) {
    return res.status(401).json({ message: "メールアドレスまたはパスワードが正しくありません" });
  }

  // ダミートークンを生成（本番ではJWTなどを使う）
  // 「メール:権限:タイムスタンプ」をBase64エンコードしたもの
  const token = Buffer.from(`${user.email}:${user.role}:${Date.now()}`).toString("base64");

  // ログイン成功 → ユーザー情報とトークンを返す
  return res.json({
    email: user.email,
    role: user.role,
    token,
  });
});

// ============================================================
// ニュース関連 API
// ============================================================

/**
 * ニュース一覧取得API
 * 全ニュースを公開日時の新しい順に返す（認証不要）
 *
 * レスポンス: ニュースオブジェクトの配列
 */
app.get("/api/news", (req, res) => {
  // 配列をコピーしてから公開日時の降順（新しい順）でソート
  const sorted = [...newsItems].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  return res.json(sorted);
});

/**
 * ニュース個別取得API
 * 指定されたSK（ID）のニュースを1件返す（認証不要）
 *
 * URLパラメータ: :sk = ニュースのID
 * 成功レスポンス: ニュースオブジェクト
 * 失敗レスポンス: 404（見つからない）
 */
app.get("/api/news/:sk", (req, res) => {
  const { sk } = req.params; // URLからニュースIDを取得
  const item = newsItems.find((n) => n.SK === sk); // IDが一致するニュースを検索

  if (!item) {
    return res.status(404).json({ message: "ニュースが見つかりません" });
  }

  return res.json(item);
});

/**
 * ニュース新規作成API（管理者のみ）
 * 新しいニュースを追加する
 *
 * ヘッダー: Authorization: Bearer <トークン>（管理者権限が必要）
 * リクエスト: { title, category, content }
 * 成功レスポンス: 201 + 作成されたニュースオブジェクト
 */
app.post("/api/news", (req, res) => {
  // --- 認証チェック開始 ---
  // AuthorizationヘッダーからBearerトークンを取得して権限を確認する
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  // トークンをデコードして権限（role）を確認する
  try {
    const token = authHeader.replace("Bearer ", ""); // "Bearer "の部分を除去
    const decoded = Buffer.from(token, "base64").toString("utf-8"); // Base64デコード
    const [, role] = decoded.split(":"); // 「メール:権限:タイムスタンプ」から権限を取得
    if (role !== "admin") {
      return res.status(403).json({ message: "管理者権限が必要です" }); // 管理者でなければ拒否
    }
  } catch {
    return res.status(401).json({ message: "無効なトークンです" }); // デコード失敗
  }
  // --- 認証チェック終了 ---

  const { title, category, content } = req.body; // リクエストからニュース情報を取得

  // タイトルは必須
  if (!title) {
    return res.status(400).json({ message: "タイトルは必須です" });
  }

  // 新しいニュースオブジェクトを作成
  const newItem = {
    SK: `news-${Date.now()}`, // ユニークなIDをタイムスタンプで生成
    title,
    category: category || "", // カテゴリーが未指定なら空文字
    content: content || "", // 本文が未指定なら空文字
    publishedAt: new Date().toISOString(), // 現在の日時を公開日に設定
  };

  newsItems.unshift(newItem); // 配列の先頭に追加（最新が先頭になる）
  return res.status(201).json(newItem); // 201（作成成功）で返す
});

/**
 * ニュース削除API（管理者のみ）
 * 指定されたSK（ID）のニュースを削除する
 *
 * URLパラメータ: :sk = ニュースのID
 * ヘッダー: Authorization: Bearer <トークン>（管理者権限が必要）
 */
app.delete("/api/news/:sk", (req, res) => {
  // --- 認証チェック（管理者のみ許可） ---
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [, role] = decoded.split(":");
    if (role !== "admin") {
      return res.status(403).json({ message: "管理者権限が必要です" });
    }
  } catch {
    return res.status(401).json({ message: "無効なトークンです" });
  }
  // --- 認証チェック終了 ---

  const { sk } = req.params; // URLからニュースIDを取得
  const index = newsItems.findIndex((n) => n.SK === sk); // 該当ニュースのインデックスを探す

  if (index === -1) {
    return res.status(404).json({ message: "ニュースが見つかりません" }); // 見つからなければ404
  }

  newsItems.splice(index, 1); // 配列から該当のニュースを削除
  return res.json({ message: "削除しました" });
});

// ============================================================
// お問い合わせ API
// ============================================================

/**
 * お問い合わせ送信API
 * ユーザーからのお問い合わせ内容を受け取る（認証不要）
 * ※現在はコンソールにログ出力するだけ（本番ではメール送信やDB保存を行う）
 *
 * リクエスト: { name, company, email, phone, category, message }
 * 必須項目: name, email, message
 */
app.post("/api/contact", (req, res) => {
  const { name, company, email, phone, category, message } = req.body;

  // 必須項目のバリデーション
  if (!name || !email || !message) {
    return res.status(400).json({ message: "お名前、メールアドレス、お問い合わせ内容は必須です" });
  }

  // 受信内容をコンソールに出力（開発中の確認用）
  console.log("お問い合わせ受信:", { name, company, email, phone, category, message });
  return res.json({ message: "お問い合わせを受け付けました" });
});

// ============================================================
// 掲示板関連 API
// ============================================================

/**
 * 掲示板データ（メモリ内で管理、2ch風のスレッド形式）
 * - id: スレッドの一意なID
 * - title: スレッドのタイトル
 * - createdAt: スレッド作成日時
 * - responses: レス（返信）の配列
 *   - num: レス番号（1から連番）
 *   - name: 投稿者名
 *   - message: 投稿内容
 *   - createdAt: 投稿日時
 */
let threads = [
  {
    id: "thread-001",
    title: "雑談スレッド",
    createdAt: "2025-06-10T10:00:00Z",
    responses: [
      { num: 1, name: "田中太郎", message: "はじめまして！掲示板テストです。", createdAt: "2025-06-10T10:00:00Z" },
      { num: 2, name: "佐藤花子", message: "よろしくお願いします！", createdAt: "2025-06-10T11:00:00Z" },
      { num: 3, name: "匿名", message: ">>1\nいい感じですね", createdAt: "2025-06-10T12:30:00Z" },
    ],
  },
  {
    id: "thread-002",
    title: "社内イベント情報共有スレ",
    createdAt: "2025-06-11T14:30:00Z",
    responses: [
      { num: 1, name: "匿名", message: "社内イベントの情報はここに書き込んでください。", createdAt: "2025-06-11T14:30:00Z" },
    ],
  },
];

/**
 * スレッド一覧取得API
 * 全スレッドの概要情報を、最終レス日時の新しい順で返す（認証不要）
 *
 * レスポンス: [{ id, title, resCount（レス数）, createdAt, lastResAt（最終レス日時） }]
 */
app.get("/api/board", (req, res) => {
  // 各スレッドから一覧表示に必要な情報だけを抽出する
  const list = threads.map((t) => ({
    id: t.id,
    title: t.title,
    resCount: t.responses.length, // レスの総数
    createdAt: t.createdAt,
    lastResAt: t.responses.length > 0
      ? t.responses[t.responses.length - 1].createdAt // 最後のレスの日時
      : t.createdAt, // レスがなければスレッド作成日時を使う
  }));

  // 最終レス日時の新しい順（アクティブなスレッドが上に来る）
  list.sort((a, b) => new Date(b.lastResAt) - new Date(a.lastResAt));
  return res.json(list);
});

/**
 * スレッド詳細取得API
 * 指定されたIDのスレッド全体（全レス含む）を返す（認証不要）
 *
 * URLパラメータ: :id = スレッドのID
 */
app.get("/api/board/:id", (req, res) => {
  const thread = threads.find((t) => t.id === req.params.id); // IDでスレッドを検索
  if (!thread) {
    return res.status(404).json({ message: "スレッドが見つかりません" });
  }
  return res.json(thread);
});

/**
 * 新規スレッド作成API
 * 新しいスレッドを作成する（認証不要 = 誰でも作成可能）
 *
 * リクエスト: { title, name（省略可）, message }
 * - title: スレッドタイトル（必須）
 * - name: 投稿者名（省略時は「匿名」）
 * - message: 最初の書き込み内容（必須）
 */
app.post("/api/board", (req, res) => {
  const { title, name, message } = req.body;

  // バリデーション: タイトル必須
  if (!title || !title.trim()) {
    return res.status(400).json({ message: "スレッドタイトルを入力してください" });
  }
  // バリデーション: 本文必須
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "本文を入力してください" });
  }

  const now = new Date().toISOString(); // 現在時刻を取得

  // 新しいスレッドオブジェクトを作成
  const thread = {
    id: `thread-${Date.now()}`, // ユニークなIDをタイムスタンプで生成
    title: title.trim(),
    createdAt: now,
    responses: [
      // スレッド作成時の最初の投稿（レス番号1）
      { num: 1, name: (name && name.trim()) || "匿名", message: message.trim(), createdAt: now },
    ],
  };

  threads.unshift(thread); // 配列の先頭に追加
  return res.status(201).json(thread);
});

/**
 * レス（返信）書き込みAPI
 * 既存のスレッドに新しいレスを追加する（認証不要 = 誰でも書き込み可能）
 *
 * URLパラメータ: :id = スレッドのID
 * リクエスト: { name（省略可）, message }
 */
app.post("/api/board/:id/res", (req, res) => {
  const thread = threads.find((t) => t.id === req.params.id); // 対象スレッドを検索
  if (!thread) {
    return res.status(404).json({ message: "スレッドが見つかりません" });
  }

  const { name, message } = req.body;

  // バリデーション: 本文必須
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "本文を入力してください" });
  }

  // 新しいレスオブジェクトを作成
  const newRes = {
    num: thread.responses.length + 1, // レス番号は既存の数+1（連番）
    name: (name && name.trim()) || "匿名", // 名前が未指定なら「匿名」
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  thread.responses.push(newRes); // スレッドのレス配列の末尾に追加
  return res.status(201).json(newRes);
});

/**
 * スレッド削除API（管理者のみ）
 * 指定されたIDのスレッドを丸ごと削除する
 *
 * URLパラメータ: :id = スレッドのID
 * ヘッダー: Authorization: Bearer <トークン>（管理者権限が必要）
 */
app.delete("/api/board/:id", (req, res) => {
  // --- 認証チェック（管理者のみ許可） ---
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "認証が必要です" });
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [, role] = decoded.split(":");
    if (role !== "admin") {
      return res.status(403).json({ message: "管理者権限が必要です" });
    }
  } catch {
    return res.status(401).json({ message: "無効なトークンです" });
  }
  // --- 認証チェック終了 ---

  const index = threads.findIndex((t) => t.id === req.params.id); // スレッドのインデックスを検索
  if (index === -1) {
    return res.status(404).json({ message: "スレッドが見つかりません" });
  }
  threads.splice(index, 1); // 配列からスレッドを削除
  return res.json({ message: "削除しました" });
});

/**
 * レス削除API（管理者のみ）
 * 指定されたレスの内容を「削除されました」に置換する
 * ※レス番号は維持される（完全削除ではなく内容の書き換え）
 *
 * URLパラメータ: :id = スレッドのID, :num = レス番号
 * ヘッダー: Authorization: Bearer <トークン>（管理者権限が必要）
 */
app.delete("/api/board/:id/res/:num", (req, res) => {
  // --- 認証チェック（管理者のみ許可） ---
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "認証が必要です" });
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [, role] = decoded.split(":");
    if (role !== "admin") {
      return res.status(403).json({ message: "管理者権限が必要です" });
    }
  } catch {
    return res.status(401).json({ message: "無効なトークンです" });
  }
  // --- 認証チェック終了 ---

  // 対象のスレッドを検索
  const thread = threads.find((t) => t.id === req.params.id);
  if (!thread) {
    return res.status(404).json({ message: "スレッドが見つかりません" });
  }

  // URLパラメータからレス番号を数値に変換して、該当レスを検索
  const num = parseInt(req.params.num, 10);
  const index = thread.responses.findIndex((r) => r.num === num);
  if (index === -1) {
    return res.status(404).json({ message: "レスが見つかりません" });
  }

  // レスの内容を「削除されました」に置換（番号やタイムスタンプは維持）
  // 完全に配列から消すのではなく、内容だけ書き換える（2ch方式）
  thread.responses[index] = {
    ...thread.responses[index], // 既存のプロパティ（num, createdAt）を保持
    name: "削除済み",
    message: "このレスは管理者により削除されました。",
  };

  return res.json({ message: "削除しました" });
});

// ============================================================
// サーバー起動
// ============================================================

import { createServer } from "http";
import { WebSocketServer } from "ws";

// ExpressをHTTPサーバーにラップ（WebSocketと同じポートで動かすため）
const server = createServer(app);

// ============================================================
// リアルタイムチャット (WebSocket)
// ============================================================

/**
 * WebSocketサーバーの初期化
 * HTTPサーバーと同じポート(3001)で WebSocket 接続を受け付ける
 * パス: ws://localhost:3001/ws/chat
 */
const wss = new WebSocketServer({ server, path: "/ws/chat" });

// チャット履歴をメモリに保持（最新100件）
const chatHistory = [];
const MAX_HISTORY = 100;

// 接続中のクライアント数を追跡
let connectionCount = 0;

// メッセージIDからメッセージ本体を引くためのマップ（リアクション用）
const messageMap = new Map(chatHistory.map((m) => [m.id, m]));

/**
 * WebSocket接続イベント
 * 新しいクライアントが接続するたびに呼ばれる
 */
wss.on("connection", (ws) => {
  connectionCount++;
  ws.userName = "匿名"; // この接続のユーザー名（後でjoinで更新）
  console.log(`[Chat] クライアント接続 (現在${connectionCount}人)`);

  // 新規接続時にチャット履歴を送信（過去のメッセージを表示するため）
  ws.send(JSON.stringify({
    type: "history",
    messages: chatHistory,
    onlineCount: connectionCount,
  }));

  // 全員にオンライン状況を通知
  broadcastPresence();

  /**
   * メッセージ受信イベント
   */
  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        // --- 参加（名前の登録・変更）---
        case "join": {
          ws.userName = (data.name && data.name.trim()) || "匿名";
          broadcastPresence();
          break;
        }

        // --- チャット送信 ---
        case "chat": {
          const chatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: (data.name && data.name.trim()) || ws.userName || "匿名",
            message: (data.message || "").trim(),
            timestamp: new Date().toISOString(),
            reactions: {}, // 絵文字ごとのカウント { "👍": 2, ... }
          };
          if (!chatMessage.message) return;

          chatHistory.push(chatMessage);
          messageMap.set(chatMessage.id, chatMessage);
          if (chatHistory.length > MAX_HISTORY) {
            const removed = chatHistory.shift();
            messageMap.delete(removed.id);
          }
          broadcast({ type: "chat", message: chatMessage });
          break;
        }

        // --- 入力中インジケーター ---
        case "typing": {
          // 送信者以外に「◯◯さんが入力中」を通知
          broadcastExcept(ws, { type: "typing", name: ws.userName });
          break;
        }

        // --- リアクション（絵文字）---
        case "reaction": {
          const target = messageMap.get(data.messageId);
          if (!target) return;
          const emoji = data.emoji;
          target.reactions = target.reactions || {};
          target.reactions[emoji] = (target.reactions[emoji] || 0) + 1;
          broadcast({
            type: "reaction",
            messageId: data.messageId,
            reactions: target.reactions,
          });
          break;
        }
      }
    } catch (err) {
      console.error("[Chat] メッセージ解析エラー:", err.message);
    }
  });

  /**
   * 切断イベント
   */
  ws.on("close", () => {
    connectionCount--;
    console.log(`[Chat] クライアント切断 (現在${connectionCount}人)`);
    broadcastPresence();
  });
});

/**
 * オンライン人数 + 参加者名リストを全員に通知
 */
function broadcastPresence() {
  const users = [];
  wss.clients.forEach((c) => {
    if (c.readyState === 1) users.push(c.userName || "匿名");
  });
  broadcast({ type: "online", onlineCount: users.length, users });
}

/**
 * 送信元を除く全クライアントに送信
 */
function broadcastExcept(sender, data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === 1) client.send(payload);
  });
}

/**
 * 全クライアントにメッセージを送信するヘルパー関数
 */
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  });
}

// HTTPサーバーを起動（Express + WebSocket が同じポートで動く）
server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`WebSocket chat at ws://localhost:${PORT}/ws/chat`);
});
