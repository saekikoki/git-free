# API Gateway + Lambda 構築仕様書

## 概要

本ドキュメントは、fsi-site フロントエンドが呼び出す全APIエンドポイントの仕様と、
対応するLambda関数のソースコードをまとめたものです。

- **リージョン**: ap-northeast-3 (大阪)
- **ランタイム**: Node.js 20.x
- **DynamoDB テーブル**: 後述
- **認証**: Authorization ヘッダーに Bearer トークン（Cognito JWT 推奨）

---

## DynamoDB テーブル設計

### テーブル1: `fsi-users`
| キー | 型 | 説明 |
|------|-----|------|
| email (PK) | String | メールアドレス |
| password | String | ハッシュ化されたパスワード |
| role | String | "admin" or "user" |

### テーブル2: `fsi-news`
| キー | 型 | 説明 |
|------|-----|------|
| PK | String | 固定値 "NEWS" |
| SK | String | "news-{timestamp}" |
| title | String | タイトル |
| category | String | カテゴリ |
| content | String | 本文 |
| publishedAt | String | ISO8601 日時 |

### テーブル3: `fsi-board`
| キー | 型 | 説明 |
|------|-----|------|
| PK | String | 固定値 "BOARD" |
| SK | String | "thread-{timestamp}" |
| title | String | スレッドタイトル |
| createdAt | String | ISO8601 日時 |
| responses | List | レス配列 [{num, name, message, createdAt}] |

### テーブル4: `fsi-contact`
| キー | 型 | 説明 |
|------|-----|------|
| PK | String | 固定値 "CONTACT" |
| SK | String | "contact-{timestamp}" |
| name | String | 送信者名 |
| company | String | 会社名・団体名（任意） |
| email | String | メールアドレス |
| phone | String | 電話番号（任意） |
| category | String | お問い合わせ種別（任意） |
| message | String | お問い合わせ内容 |
| createdAt | String | ISO8601 日時 |

---

## APIエンドポイント一覧

| # | メソッド | パス | 認証 | Lambda関数名 | 説明 |
|---|----------|------|------|-------------|------|
| 1 | POST | /api/login | 不要 | fsi-login | ログイン認証 |
| 2 | GET | /api/news | 不要 | fsi-news-list | ニュース一覧 |
| 3 | GET | /api/news/{sk} | 不要 | fsi-news-get | ニュース詳細 |
| 4 | POST | /api/news | 管理者 | fsi-news-create | ニュース投稿 |
| 5 | DELETE | /api/news/{sk} | 管理者 | fsi-news-delete | ニュース削除 |
| 6 | POST | /api/contact | 不要 | fsi-contact | お問い合わせ送信 |
| 7 | GET | /api/board | 不要 | fsi-board-list | スレッド一覧 |
| 8 | GET | /api/board/{id} | 不要 | fsi-board-get | スレッド詳細 |
| 9 | POST | /api/board | 不要 | fsi-board-create | スレッド作成 |
| 10 | POST | /api/board/{id}/res | 不要 | fsi-board-res | レス書き込み |
| 11 | DELETE | /api/board/{id} | 管理者 | fsi-board-delete | スレッド削除 |
| 12 | DELETE | /api/board/{id}/res/{num} | 管理者 | fsi-board-res-delete | レス削除 |

---

## API Gateway 設定メモ

- CORSを全エンドポイントで有効化（`Access-Control-Allow-Origin: *`）
- 「管理者」マークのエンドポイントは、Lambda内でAuthorizationヘッダーを検証
- パスパラメータ: `{sk}`, `{id}`, `{num}` を設定

---
