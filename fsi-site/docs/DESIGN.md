# FSI-STYLE CORP サイト 設計書

## 1. 全体アーキテクチャ

### 1.1 システム構成図

```
┌─────────────────────────────────────────────────────┐
│                    ユーザー（ブラウザ）                   │
└─────────────────────────┬───────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────┐
│              フロントエンド (React SPA)                  │
│  ・Vite 8 / React 19 / React Router v7              │
│  ・S3 + CloudFront (本番) / localhost:5173 (開発)    │
└─────────────────────────┬───────────────────────────┘
                          │ /api/* (プロキシ)
                          ▼
┌─────────────────────────────────────────────────────┐
│                  バックエンド API                       │
│                                                     │
│  【ローカル開発】Express (localhost:3001)              │
│  【本番 AWS】API Gateway + Lambda (Node.js 20.x)     │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  データストア                           │
│                                                     │
│  【ローカル】メモリ内（サーバー再起動でリセット）          │
│  【本番】DynamoDB (4テーブル)                          │
└─────────────────────────────────────────────────────┘
```

### 1.2 技術スタック

| レイヤー | ローカル開発 | 本番 (AWS) |
|----------|-------------|------------|
| フロントエンド | Vite dev server (5173) | S3 + CloudFront |
| API | Express (3001) | API Gateway + Lambda |
| データ | メモリ内 | DynamoDB |
| 認証 | Base64ダミートークン | Cognito JWT (推奨) |
| リージョン | - | ap-northeast-3 (大阪) |

### 1.3 環境切り替え

```
npm run dev       → .env.local → localhost:3001
npm run dev:aws   → .env.aws   → API Gateway
npm run build:aws → 本番ビルド
```

---

## 2. 画面設計

### 2.1 画面一覧

| # | パス | 画面名 | 認証 | 説明 |
|---|------|--------|------|------|
| 1 | `/` | トップページ | 不要 | ヒーロー、事業内容、ニュース(3件)、実績カルーセル |
| 2 | `/news` | ニュース一覧 | 不要 | 全ニュースをリスト表示 |
| 3 | `/news/:sk` | ニュース詳細 | 不要 | 個別ニュースの本文表示 |
| 4 | `/board` | 掲示板一覧 | 不要 | スレッド一覧テーブル + 検索 + 新規作成 |
| 5 | `/board/:id` | スレッド詳細 | 不要 | 2ch形式レス表示 + 書き込みフォーム |
| 6 | `/page1` | 会社概要 | 不要 | 富士ソフト会社情報テーブル |
| 7 | `/entry` | 採用情報 | 不要 | 採用ページ |
| 8 | `/contact` | お問い合わせ | 不要 | フォーム(名前,会社,メール,電話,種別,内容) + 電話案内 |
| 9 | `/login` | ログイン | 不要 | メール + パスワード |
| 10 | `/admin` | 管理者パネル | 管理者 | ニュース投稿/削除 |
| 11 | `/privacy` | 個人情報保護 | 不要 | 静的ページ |
| 12 | `/terms` | 利用規約 | 不要 | 静的ページ |
| 13 | `/sitemap` | サイトマップ | 不要 | 全ページリンク一覧 |

### 2.2 画面遷移図

```
トップページ (/)
├── [事業内容] → /#services (ページ内スクロール)
├── [ニュース] → /#news (ページ内スクロール)
│   ├── [ニュース一覧を表示する] → /news
│   └── [各ニュース →] → /news/:sk
├── [掲示板] → /board
│   └── [スレッドタイトル] → /board/:id
├── [企業情報] → /page1
├── [お問い合わせ] → /contact
├── [ログイン] → /login → (成功) → /admin or /
└── [管理] → /admin (管理者のみ表示)

フッター
├── [個人情報保護] → /privacy
├── [サイトのご利用について] → /terms
└── [サイトマップ] → /sitemap
```

### 2.3 共通レイアウト

```
┌────────────────────────────────────────┐
│ Header (ロゴ / PC Nav / ハンバーガー)    │
├────────────────────────────────────────┤
│                                        │
│            <main> コンテンツ             │
│                                        │
├────────────────────────────────────────┤
│ Footer (ナビ / 著作権 / SNSリンク)       │
└────────────────────────────────────────┘
```

### 2.4 レスポンシブ対応

- ブレークポイント: 768px (モバイル/PC切り替え)
- モバイル: ハンバーガーメニュー、1カラムレイアウト
- PC: 横並びナビ、グリッドレイアウト

---

## 3. API設計

### 3.1 エンドポイント一覧

| # | メソッド | パス | 認証 | リクエスト | レスポンス |
|---|----------|------|------|-----------|-----------|
| 1 | POST | `/api/login` | 不要 | `{email, password}` | `{email, role, token}` |
| 2 | GET | `/api/news` | 不要 | - | `[{SK, title, category, content, publishedAt}]` |
| 3 | GET | `/api/news/:sk` | 不要 | - | `{SK, title, category, content, publishedAt}` |
| 4 | POST | `/api/news` | 管理者 | `{title, category, content}` | `{SK, title, category, content, publishedAt}` |
| 5 | DELETE | `/api/news/:sk` | 管理者 | - | `{message}` |
| 6 | POST | `/api/contact` | 不要 | `{name, company, email, phone, category, message}` | `{message}` |
| 7 | GET | `/api/board` | 不要 | - | `[{id, title, resCount, createdAt, lastResAt}]` |
| 8 | GET | `/api/board/:id` | 不要 | - | `{id, title, createdAt, responses[]}` |
| 9 | POST | `/api/board` | 不要 | `{title, name, message}` | `{id, title, createdAt, responses[]}` |
| 10 | POST | `/api/board/:id/res` | 不要 | `{name, message}` | `{num, name, message, createdAt}` |
| 11 | DELETE | `/api/board/:id` | 管理者 | - | `{message}` |
| 12 | DELETE | `/api/board/:id/res/:num` | 管理者 | - | `{message}` |

### 3.2 認証方式

**ローカル開発:**
- `POST /api/login` でBase64エンコードしたダミートークンを発行
- トークン形式: `base64(email:role:timestamp)`
- 管理者APIは `Authorization: Bearer {token}` ヘッダーで検証

**本番 (推奨):**
- Amazon Cognito によるJWT認証
- API Gatewayのオーソライザーで検証

### 3.3 エラーレスポンス

| ステータス | 意味 | レスポンス例 |
|-----------|------|-------------|
| 400 | バリデーションエラー | `{"message": "タイトルは必須です"}` |
| 401 | 未認証 | `{"message": "認証が必要です"}` |
| 403 | 権限不足 | `{"message": "管理者権限が必要です"}` |
| 404 | リソース不在 | `{"message": "ニュースが見つかりません"}` |
| 500 | サーバーエラー | `{"message": "Internal Server Error"}` |

### 3.4 CORS設定

- `Access-Control-Allow-Origin: *`
- API Gatewayでは各リソースにOPTIONSメソッド（プリフライト）も設定が必要

---

## 4. データベース設計

### 4.1 DynamoDB テーブル一覧

| テーブル名 | PK | SK | 用途 |
|-----------|-----|-----|------|
| fsi-users | email (S) | - | ユーザー認証 |
| fsi-news | PK="NEWS" (S) | SK="news-{ts}" (S) | ニュース記事 |
| fsi-board | PK="BOARD" (S) | SK="thread-{ts}" (S) | 掲示板スレッド |
| fsi-contact | PK="CONTACT" (S) | SK="contact-{ts}" (S) | お問い合わせ |

### 4.2 テーブル詳細

#### fsi-users

| 属性名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| email | String (PK) | ○ | メールアドレス |
| password | String | ○ | ハッシュ化パスワード (SHA-256) |
| role | String | ○ | "admin" or "user" |

#### fsi-news

| 属性名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| PK | String | ○ | 固定値 "NEWS" |
| SK | String | ○ | "news-{timestamp}" |
| title | String | ○ | タイトル |
| category | String | - | カテゴリ (お知らせ, 組織 等) |
| content | String | - | 本文 |
| publishedAt | String | ○ | ISO8601 投稿日時 |

#### fsi-board

| 属性名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| PK | String | ○ | 固定値 "BOARD" |
| SK | String | ○ | "thread-{timestamp}" |
| title | String | ○ | スレッドタイトル |
| createdAt | String | ○ | ISO8601 作成日時 |
| responses | List | ○ | レス配列 |

**responses 配列の各要素:**

| 属性名 | 型 | 説明 |
|--------|-----|------|
| num | Number | レス番号 (1〜) |
| name | String | 投稿者名 |
| message | String | 本文 |
| createdAt | String | ISO8601 投稿日時 |

#### fsi-contact

| 属性名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| PK | String | ○ | 固定値 "CONTACT" |
| SK | String | ○ | "contact-{timestamp}" |
| name | String | ○ | お名前 |
| company | String | - | 会社名・団体名 |
| email | String | ○ | メールアドレス |
| phone | String | - | 電話番号 |
| category | String | - | お問い合わせ種別 |
| message | String | ○ | お問い合わせ内容 |
| createdAt | String | ○ | ISO8601 受付日時 |

---

## 5. セキュリティ設計

### 5.1 現状（ローカル開発用）

| 項目 | 状態 | リスク |
|------|------|--------|
| パスワード保存 | 平文 | 高 |
| トークン | Base64（署名なし） | 高 |
| CSRF | 対策なし | 中 |
| XSS | Reactが自動エスケープ | 低 |
| CORS | 全許可 | 中 |

### 5.2 本番化に向けた対応事項

| 項目 | 対応方針 |
|------|---------|
| 認証 | Amazon Cognito (JWT) に移行 |
| パスワード | Cognitoが内部でSRP認証を使用（平文不要） |
| CORS | CloudFrontのドメインのみ許可 |
| レート制限 | API Gateway のスロットリング設定 |
| WAF | AWS WAF をCloudFront/API Gatewayに適用 |
| HTTPS | CloudFront + ACM証明書 |
| 掲示板スパム対策 | reCAPTCHA or 投稿頻度制限 |

---

## 6. ファイル構成

作業フォルダ全体の構成と、機能を追加するときの置き場所のルールは [README の「作業フォルダの構成」](../README.md#作業フォルダの構成) にまとめています（二重管理を避けるため、本書には載せません）。

要点:

| 場所 | 内容 |
|------|------|
| `src/features/<機能名>/` | 画面と、その機能だけで使う部品・データ・状態管理 |
| `src/editions/{full,lite}/` | 版ごとのルーティング・リンク・データ取得方法 |
| `backend/lambdas/` | 本番 API（Lambda） |
| `backend/local-server/` | ローカル開発用 API サーバー |
| `infra/` | AWS 構築（CDK・デプロイスクリプト） |
| `docs/` | 設計書・API仕様・手順書 |

---

## 7. 非機能要件

| 項目 | 要件 |
|------|------|
| レスポンシブ | 768px ブレークポイント、モバイル対応 |
| ブラウザ対応 | Chrome/Edge/Firefox/Safari 最新版 |
| アクセシビリティ | ARIA属性、フォーカストラップ、aria-live |
| SEO | ページごとの title/description (React 19 native) |
| パフォーマンス | CSS分割、Viteバンドル最適化 |
| 可用性(本番) | CloudFront CDN、Lambda auto-scaling |

---

## 8. テストアカウント（ローカル開発）

| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 管理者 | admin@fsi.co.jp | password |
| 一般 | user@fsi.co.jp | password |

---

## 改訂履歴

| 日付 | 内容 |
|------|------|
| 2025-07-11 | 初版作成 |
