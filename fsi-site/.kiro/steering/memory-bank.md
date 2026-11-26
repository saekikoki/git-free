---
inclusion: auto
---

# メモリーバンク: fsi-site プロジェクト

## プロジェクト概要

富士ソフト株式会社のコーポレートサイトを模した社内学習・プロトタイプ用Webアプリケーション（表示名: FSI-STYLE CORP）。

- **技術スタック**: React 19 + Vite 8 + React Router v7
- **CSSフレームワーク**: なし（カスタムCSS: 入口は `src/styles/index.css`、画面ごとに `src/styles/*.css`）
- **パッケージマネージャー**: npm（`node_modules` は WSL 側でインストール済み。Windows の Node ではビルド不可）
- **`"type": "module"`** (ES Modules)
- 回答・説明は日本語。コードには初心者向けのコメントを付ける

## 版（エディション）

同じソースから2種類をビルドする。`vite.config.js` が `--mode lite` を見て `@edition` の参照先を切り替える。

| | フル版 | 廉価版 |
|---|---|---|
| 参照先 | `src/editions/full` | `src/editions/lite` |
| 出力 | `dist/` | `dist-lite/` |
| 構成 | S3 + CloudFront + API Gateway + Lambda + DynamoDB | S3 静的ホスティングのみ |
| 機能 | 全機能（掲示板・チャット・ゲーム・ログイン・管理・問い合わせフォーム） | トップ・ニュース(Markdown)・企業情報・採用・FAQ・検索・規約・お問い合わせ（メール・電話の案内のみ）。日英対応・ダークモード・事前HTML化 |

廉価版の追加機能（2026-07）:
- 文言は `src/content/{ja,en}/*.js`（`useContent()`）。英語は `/en/...`。リンクは `src/i18n/LocalizedLink.jsx`
- ニュースは `src/editions/lite/news/*.md`（英語版 `*.en.md`）。`newsLoader.js` が読み込み・検証
- `build:lite` = client build → SSR build（`src/editions/lite/entry-server.jsx` → `.ssr-lite`）→ `scripts/lite/prerender.mjs`（全ページHTML・404.html・sitemap.xml・robots.txt・feed.xml）
- `main.jsx` は中身があれば hydrateRoot。`<head>` の `[data-pre]` を消してから描画。URLの ?q= 等は `useHydrated()` が true になってから使う
- `check:lite`（`scripts/lite/check.mjs`）でリンク切れ等を検査。deploy-lite.sh は VITE_SITE_URL を S3 URL に自動設定し、エラー時はアップロードしない
- CloudFront 版: `infra/lib/lite-cdn-stack.ts`（GonHpLiteStack、`cdk ... -c edition=lite`）、`deploy-lite-cdn.sh` / `destroy-lite-cdn.sh`
- GitHub Actions: `.github/workflows/lite-check.yml`・`lite-deploy.yml`（OIDC、secret AWS_ROLE_ARN）

## ファイル構成

詳細は `README.md` の「作業フォルダの構成」が正。要点:

```
fsi-site/
├── src/
│   ├── main.jsx               # @edition/App と styles/index.css を読み込む
│   ├── editions/{full,lite}/  # App.jsx(ルート) / config.js(リンク等) / dataSource.js
│   ├── features/<機能>/       # home news company legal contact auth board chat game
│   │                          #   機能専用の状態・データも同じフォルダ（auth/AuthContext.jsx, game/castles.js）
│   ├── components/layout/     # Header Footer PageHead ScrollToTop
│   └── styles/                # index.css（入口）+ 画面ごとの CSS
├── public/
├── backend/
│   ├── local-server/index.js  # ローカル Express API（ポート3001、npm run server）
│   └── lambdas/fsi-*.mjs      # 本番 Lambda（12本）
├── infra/                     # CDK（lib/fsi-site-stack.ts は ../../backend/lambdas を参照）+ scripts/
├── docs/                      # DESIGN.md API_SPEC.md TEARDOWN.md EDITING_LITE.md
└── package.json / vite.config.js / index.html / .env.local / .env.aws（Vite の決まりでルート）
```

## ルーティング（フル版）

`/` `/news` `/news/:sk` `/company` `/recruit` `/contact` `/board` `/board/:id` `/chat` `/game` `/login` `/admin` `/privacy` `/terms` `/sitemap`
（廉価版は board / chat / game / login / admin なし。未定義パスはトップへ）

## 認証システム（フル版）

- **AuthContext** (`src/features/auth/AuthContext.jsx`): login/logout/isAdmin を提供
- `localStorage` に `auth_user` キーで永続化
- ログインAPI: `POST /api/login` → `{ email, role, token }`
- 認証は DynamoDB のユーザーテーブル（Cognito 移行は中止）

## APIエンドポイント一覧（全12本）

| # | メソッド | パス | 認証 | 説明 |
|---|----------|------|------|------|
| 1 | POST | /api/login | 不要 | ログイン認証 |
| 2 | GET | /api/news | 不要 | ニュース一覧 |
| 3 | GET | /api/news/:sk | 不要 | ニュース詳細 |
| 4 | POST | /api/news | 管理者 | ニュース投稿 |
| 5 | DELETE | /api/news/:sk | 管理者 | ニュース削除 |
| 6 | POST | /api/contact | 不要 | お問い合わせ送信 |
| 7 | GET | /api/board | 不要 | スレッド一覧 |
| 8 | GET | /api/board/:id | 不要 | スレッド詳細 |
| 9 | POST | /api/board | 不要 | スレッド作成 |
| 10 | POST | /api/board/:id/res | 不要 | レス書き込み |
| 11 | DELETE | /api/board/:id | 管理者 | スレッド削除 |
| 12 | DELETE | /api/board/:id/res/:num | 管理者 | レス削除 |

## AWS

- リソース名はすべて `gon-hp` 接頭辞（スタック `GonHpStack`、テーブル `gon-hp-users/news/board/contact`、Lambda `gon-hp-*`、API `gon-hp-api`、バケット `gon-hp-frontend-<acct>`、廉価版バケット `gon-hp-lite-<acct>`）
- リージョン: ap-northeast-3
- CDK は CommonJS + ts-node。コマンドは `--all` ではなく `GonHpStack` を明示

## 環境切り替え（フル版）

```bash
npm run dev       # ローカル（.env.local → localhost:3001）
npm run dev:aws   # AWS（.env.aws → API Gateway）
npm run build:aws # AWS向けビルド
```

## ビルドの実行方法（エージェント用メモ）

- Windows の Node では `@rolldown/binding-win32-x64-msvc` がなく失敗する
- `wsl.exe --cd "<WSLパス>" -e bash -ic "npm run build:lite"`（`-ic` で対話シェルにしないと Node 18 になり失敗）
- PowerShell の出力は文字化けするので、ログファイルに出して読み、読んだら削除する

## テストアカウント（ローカル開発用）

| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 管理者 | admin@fsi.co.jp | password |
| 一般 | user@fsi.co.jp | password |

## 未解決・今後の課題

- ニュース編集機能（PUT）
- お問い合わせの送信先（SES/SNS等）
- 会社情報は架空のサンプル（`src/content/company-profile.js` に一元化。ユーザーがサイト完成後に実際の会社情報へ差し替え予定）
- 独自ドメインはユーザーが用意済み（サイト完成後に設定）。公開までの手順は `docs/TODO_LAUNCH.md`

廉価版の SEO 対応（2026-07）:
- 文言はページごとに遅延読み込み（`content/index.js` の `loadContent`）。ページが使う文言は `editions/lite/routes.js` の `content` に必ず書く
- ページごとのコード分割: `pageEntries.js`（import）・`LazyPage.jsx`・`boot.js`（hydrate 前に該当ページ・文言・記事本文を読み込む）
- Markdown は Vite プラグイン `scripts/lite/markdown.mjs` でビルド時に HTML 化（`?meta` で一覧用、無印で本文）
- 公開URL未設定ビルドは NOINDEX_ALL（全ページ noindex、robots.txt Disallow）。デプロイは `check:lite -- --require-site-url`
- サイト内リンクは末尾 `/`（`withTrailingSlash`）。CloudFront Function は `/x` → `/x/` に 301
- 英語版のない記事は `/en/` ページを作らない（一覧から日本語ページへリンク、hreflang も出さない）
- 404.html は `#root[data-path]` で別URL用と判定して hydrate せず createRoot（React #418 対策）
- 追加ページ: /services/, /services/:slug/, /cases/, /cases/:slug/, /recruit/jobs/:slug/（JobPosting）, /columns/
