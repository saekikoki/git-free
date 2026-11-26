# FSI-STYLE CORP サイト

React + Vite で構築したコーポレートサイトです。
同じソースから **フル版** と **廉価版** の2種類をビルドできます。

## エディション（版）の違い

| | フル版 | 廉価版 |
|---|---|---|
| 用途 | 掲示板・チャット・ログインまで含む全機能 | 会社紹介サイトとして必要な機能だけ |
| 動作環境 | S3 + CloudFront + API Gateway + Lambda + DynamoDB | **S3 静的ホスティングのみ**（HTTPS が必要なら + CloudFront） |
| サーバー / DB | 必要 | **不要** |
| 月額の目安 | 3,000〜5,000円 | 数円〜数十円（S3の保存・転送料のみ） |
| ニュース | 管理画面から投稿・削除 | `src/editions/lite/news/*.md`（1記事1ファイル）を編集して再ビルド |
| お問い合わせ | フォームからAPIに送信してDBに保存 | **フォームなし**。メールアドレスと電話番号を案内するページ |
| 掲示板 / チャット / ゲーム / ログイン / 管理画面 | あり | なし |
| トップ・ニュース・企業情報・採用・規約 | あり | あり（デザイン共通） |
| 英語ページ（`/en/...`） | なし | あり（ヘッダーの EN / JP で切り替え） |
| よくある質問・サイト内検索・RSS・ダークモード | なし | あり |
| ページごとの事前HTML化・sitemap.xml・SNS共有カード | なし | あり（検索エンジン・SNS 向け） |
| ビルド出力先 | `dist/` | `dist-lite/` |

### 廉価版の機能

サーバーなしで動く範囲で、次の機能を入れています。

| 機能 | 内容 |
|------|------|
| 事前HTML化 | ビルド時に全ページを1枚ずつ HTML にする（`dist-lite/company/index.html` など）。検索エンジンや SNS がページごとのタイトル・本文を読め、`/company/` を直接開いても HTTP 200 で返る |
| SEO / SNS | ページごとの canonical・OGP（共有カード画像 `public/ogp.png`）・hreflang（日英の対応。英語版のあるページだけ）・構造化データ（会社と住所・サイト・記事・パンくず・サービス・求人・FAQ）。`sitemap.xml`（更新日つき）と `robots.txt` を自動生成。検索エンジンの所有権確認タグも設定できる |
| 公開URL未設定の保護 | 公開URLが決まっていない確認用ビルドは、全ページ noindex・robots.txt で巡回禁止にする。デプロイスクリプトは確認用ビルドを公開しない |
| URL の統一 | サイト内リンクは末尾 `/` 付きにそろえる。CloudFront 版は `/company` を `/company/` に 301 転送 |
| 表示速度 | ページごとのコード分割（開いたページの JS・文言だけを読む）、ページごとの先読み指定、Markdown はビルド時に HTML 化、Web フォントは表示を止めずに読み込む、フル版だけの CSS を除外 |
| 404 ページ | 存在しない URL には「ページが見つかりません」（`404.html`）を返す |
| 事業内容 | `/services/` と事業ごとの詳細ページ（課題・提供内容・進め方・関連事例・FAQ） |
| 導入事例 | `/cases/` と事例ごとの詳細ページ（課題・取り組み・成果・お客様の声）。業界で絞り込み |
| ニュース・コラム | Markdown で記事を書く（見出し・表・画像・リンク）。ニュースは `/news/`、コラムは `/columns/`。カテゴリ・年・キーワードで絞り込み、10件ごとのページ送り、関連記事、前後の記事、SNS シェア・リンクのコピー・印刷 |
| RSS | `/feed.xml`（日本語）・`/en/feed.xml`（英語）を自動生成 |
| サイト内検索 | `/search/`。ページ本文・事業・事例・求人・ニュース・コラムを、ブラウザの中だけで検索する |
| 英語ページ | 全ページに `/en/...` がある。文言は `src/content/en/`。英語版のない記事は英語ページを作らず、英語の一覧から日本語のページへリンクする |
| ダークモード | ヘッダーの ☾ で切り替え。初回は端末の設定に合わせる |
| よくある質問 | `/faq`。カテゴリ・キーワードで絞り込み、開閉式 |
| 採用情報 | 職種・採用区分での絞り込み、職種ごとの詳細ページ（Google の求人検索用データつき）、社員インタビュー、選考フローの目安期間 |
| 会社情報の一元管理 | 社名・住所・連絡先・SNS は `src/content/company-profile.js` の1か所だけを書き換えればよい（今は架空のサンプル） |
| アクセス | 企業情報ページに住所・最寄り駅・地図。地図はボタンを押したときだけ Google マップを読み込む |
| 動きの演出 | スクロールでフェードイン、数字のカウントアップ。端末の「視差効果を減らす」設定では動かさない |
| 印刷 | メニューや装飾を消した印刷用レイアウト |
| 公開前チェック | `npm run check:lite` でリンク切れ・画像の付け忘れ・alt なし画像・仮の連絡先などを検出 |
| HTTPS・独自ドメイン | `deploy-lite-cdn.sh` で CloudFront 経由の配信（任意） |
| 自動デプロイ | GitHub Actions（`.github/workflows/`）。プルリクエストでチェック、`main` への push でデプロイ |

## 作業フォルダの構成

役割ごとに4つの場所に分かれています。

| 場所 | 役割 | 使う版 |
|------|------|--------|
| `src/`、`public/` | フロントエンド（ブラウザで動く画面） | 両方 |
| `backend/` | サーバー側のプログラム（API） | フル版のみ |
| `infra/` | AWS の環境を作る・消すためのコードとスクリプト | 両方（版ごとにスクリプトが別） |
| `docs/` | 設計書・手順書 | — |

### 全体

```
fsi-site/
├── README.md              ← このファイル（入口）
│
├── src/                   ← ★ フロントエンドのソース（詳細は下の「src の中身」）
├── public/                ← 加工せずそのまま公開するファイル（favicon など）
├── index.html             ← 画面の土台になる HTML
│
├── backend/               ← ★ サーバー側（フル版だけで使う）
│   ├── local-server/      ←   ローカル開発用APIサーバー（Express、ポート3001）
│   │   └── index.js       ←     npm run server で起動
│   └── lambdas/           ←   AWS Lambda 関数（本番のAPI、12本）
│       └── fsi-*.mjs      ←     ファイル名 = 機能名（例: fsi-news-list.mjs = ニュース一覧）
│
├── infra/                 ← ★ AWS 環境の構築
│   ├── README.md          ←   CDK の使い方
│   ├── bin/app.ts         ←   CDK の起動ファイル
│   ├── lib/fsi-site-stack.ts ← フル版の AWS 構成（S3・CloudFront・API Gateway・Lambda・DynamoDB）
│   ├── lib/lite-cdn-stack.ts ← 廉価版の CloudFront 配信（HTTPS・独自ドメイン。任意）
│   ├── cloudformation/    ←   廉価版の CloudFormation テンプレート（lite-site.yaml）と deploy.sh / destroy.sh
│   ├── scripts/
│   │   ├── deploy.sh / destroy.sh / seed-users.sh  ← フル版
│   │   ├── deploy-lite.sh / destroy-lite.sh        ← 廉価版（S3 のみ・HTTP）
│   │   └── deploy-lite-cdn.sh / destroy-lite-cdn.sh ← 廉価版（S3 + CloudFront・HTTPS）
│   └── package.json       ←   CDK 用の依存関係（フロントとは別管理）
│
├── scripts/lite/          ← ★ 廉価版のビルド用スクリプト（Node.js）
│   ├── prerender.mjs      ←   ページの事前HTML化、sitemap.xml・robots.txt・RSS の生成
│   └── check.mjs          ←   公開前チェック（npm run check:lite）
│
├── .github/workflows/     ← GitHub Actions（廉価版の自動チェック・自動デプロイ）
│
├── docs/                  ← ★ ドキュメント
│   ├── DESIGN.md          ←   設計書（画面・API・DB・構成）
│   ├── API_SPEC.md        ←   API仕様（パス一覧、DynamoDB テーブル設計）
│   ├── TEARDOWN.md        ←   AWS 環境を安全に削除する手順
│   ├── EDITING_LITE.md    ←   廉価版のニュース・文言の編集方法、自動デプロイの準備
│   ├── CLOUDFORMATION_LITE.md ← 廉価版を CloudFormation で構築する手順（AWS CLI の準備から）
│   └── GIT_ACCOUNTS.md    ←   複数の GitHub アカウントの使い分け
│
├── package.json           ← フロントエンドとローカルサーバーの依存関係・npm scripts
├── vite.config.js         ← ビルド設定（版の切り替え、出力先、API の中継先）
├── eslint.config.js       ← コードチェックの設定
├── .env.local / .env.aws  ← フル版の API 接続先（「APIの接続先」参照）
├── .env.lite              ← 廉価版の公開URL（独自ドメインのときだけ設定）
│
├── .kiro/                 ← Kiro（AI アシスタント）用の設定。サイトの動作には無関係
│
│   ── 以下は自動で作られる。編集しない・共有しない ──
├── node_modules/          ← npm install で入るライブラリ
├── dist/                  ← フル版のビルド結果
├── dist-lite/             ← 廉価版のビルド結果
└── .ssr-lite/             ← 廉価版ビルド中の一時ファイル（ビルドの最後に自動で消える）
```

> `package.json`・`vite.config.js`・`index.html`・`.env.*` は、Vite の決まりでプロジェクト直下に置く必要があります。

### src の中身

```
src/
├── main.jsx                 ← 起動ファイル。@edition/App と styles/index.css を読み込む
│
├── editions/                ← ★ 版ごとの違いはここだけ
│   ├── full/                ← フル版
│   │   ├── App.jsx          ←   ルーティング（全ページ）
│   │   ├── boot.js          ←   表示前の準備（文言の読み込み）
│   │   ├── config.js        ←   ヘッダー/フッター/サイトマップのリンク
│   │   └── dataSource.js    ←   ニュース・問い合わせ → API を呼ぶ
│   └── lite/                ← 廉価版
│       ├── App.jsx          ←   ルーティング（日本語 / と英語 /en/ の両方）
│       ├── routes.js        ←   ★ ページの一覧と、各ページで使う文言（事前HTML化・sitemap.xml もこれを使う）
│       ├── pageEntries.js   ←   ページごとのプログラムの読み込み口（コード分割）
│       ├── LazyPage.jsx     ←   ページのプログラムと文言を読み込んでから表示する部品
│       ├── boot.js          ←   表示前の準備（開いたページの分を先に読み込む）
│       ├── entry-server.jsx ←   ビルド時にページを HTML にする入口（ブラウザでは使わない）
│       ├── HeaderTools.jsx  ←   ヘッダー右端の 検索・ダークモード・EN/JP
│       ├── ContactPage.jsx  ←   お問い合わせページ（メール・電話の案内。フォームなし）
│       ├── config.js        ←   公開URL、検索エンジンの確認コード、機能のオン/オフ、リンク
│       ├── dataSource.js    ←   ニュース・コラム → Markdown
│       ├── newsLoader.js    ←   Markdown の読み込み（一覧用の情報は最初に、本文は開いたときに）
│       ├── useLitePageEffects.js ← ページ切り替え時の処理（<html lang>、フェードイン）
│       ├── news/*.md        ←   ★ ニュース記事（1記事1ファイル。英語版は *.en.md）
│       └── columns/*.md     ←   ★ コラム記事（書き方はニュースと同じ）
│
├── content/                 ← ★ 画面に出る文言（フル版・廉価版で共通）
│   ├── company-profile.js   ←   ★ 会社の基本情報（社名・住所・連絡先・SNS。公開前に書き換える）
│   ├── ja/                  ←   日本語（home / services / cases / company / recruit / faq / contact / legal / common / search）
│   ├── en/                  ←   英語（ja/ と同じファイル名・同じ項目名）
│   └── index.js             ←   今の言語の文言を返す useContent()（文言はページごとに分けて読み込む）
│
├── i18n/                    ← 言語の判定（URL が /en で始まれば英語）と言語つきリンク
│
├── features/                ← ★ 機能ごとのフォルダ。1機能 = 1フォルダ
│   ├── home/                ← トップページ（Hero / Services / Achievements）  … 共通
│   ├── services/            ← 事業内容の一覧・詳細                            … 共通
│   ├── cases/               ← 導入事例の一覧・詳細                            … 共通
│   ├── news/                ← ニュース（廉価版はコラムも）の一覧・詳細        … 共通
│   ├── company/             ← 企業情報（アクセス地図）・採用情報・職種の詳細  … 共通
│   ├── legal/               ← 個人情報保護方針・利用規約・サイトマップ        … 共通
│   ├── faq/                 ← よくある質問                                    … 廉価版のみ
│   ├── search/              ← サイト内検索                                    … 廉価版のみ
│   ├── errors/              ← 404（ページが見つかりません）                   … 廉価版のみ
│   ├── contact/             ← お問い合わせフォーム                            … フル版のみ
│   ├── auth/                ← ログイン・管理画面・ログイン状態(AuthContext) … フル版のみ
│   ├── board/               ← 掲示板                                          … フル版のみ
│   ├── chat/                ← チャット                                        … フル版のみ
│   └── game/                ← 戦国ゲーム（城データ castles.js を含む）        … フル版のみ
│
├── components/
│   ├── layout/              ← 全ページ共通の枠（ヘッダー・フッター・PageHead・SEO 用の関数）
│   └── ui/                  ← 小さな共通部品（数字のカウントアップ、改行表示、表示タイミングのフック）
│
└── styles/                  ← CSS
    ├── index.css            ←   入口。ここで全 CSS を @import する
    ├── base.css             ←   全体の土台（色・文字・余白）
    ├── <画面名>.css         ←   画面ごとの CSS（header.css、news.css、faq.css など）
    ├── motion.css           ←   スクロールのフェードイン
    ├── dark.css             ←   ダークモードの色
    └── print.css            ←   印刷用
```

### 拡張するときのルール

今後機能を増やしても迷わないよう、置き場所を次のように決めています。

| 追加したいもの | 置き場所 | あわせて行うこと |
|------|------|------|
| 新しい画面・機能 | `src/features/<機能名>/` を作る。その機能だけで使う部品・データ・状態管理も同じフォルダに入れる | 使う版の `src/editions/<版>/App.jsx` にルートを追加（廉価版は `routes.js` にも追加）。メニューに出すなら `config.js` にリンクを追加 |
| 画面の文言 | `src/content/ja/<画面名>.js` と `src/content/en/<画面名>.js` | `src/content/index.js` に読み込みを追加。画面では `useContent()` で取り出す |
| サイト内リンク | `src/i18n/LocalizedLink.jsx` の `<Link>` を使う | 英語ページでは自動で `/en/...` に変わる |
| 画面の CSS | `src/styles/<機能名>.css` | `src/styles/index.css` に `@import` を1行追加 |
| 複数の機能で使う部品 | `src/components/` の下（枠なら `layout/`、ボタンなどは `ui/` を新設） | — |
| API（本番） | `backend/lambdas/fsi-<機能>-<操作>.mjs` | `infra/lib/fsi-site-stack.ts` に Lambda と API のパスを追加。`docs/API_SPEC.md` に追記 |
| API（ローカル開発） | `backend/local-server/index.js` | 本番の Lambda と同じパス・同じ応答にする |
| 新しい版（例: 中間グレード） | `src/editions/<版名>/` に `App.jsx`・`config.js`・`dataSource.js` を作る | `vite.config.js` と `package.json` に `--mode <版名>` を追加 |
| 設計書・手順書 | `docs/` | README から必要に応じてリンク |
| 画像 | 画面から import するなら `src/features/<機能名>/` 内、URL で直接参照するなら `public/images/` | — |

### 版の切り替えの仕組み

`vite.config.js` が `--mode lite` かどうかを見て、`@edition` という別名の参照先を切り替えます。

```
npm run build       → @edition = src/editions/full → dist/
npm run build:lite  → @edition = src/editions/lite → dist-lite/
```

共通ページ（ヘッダー、フッター、ニュースなど）は `@edition/config` や `@edition/dataSource` を読み込むだけなので、同じコードのまま版ごとに動作が変わります。
選ばれなかった版のコード（廉価版ビルド時の掲示板・チャット・ゲーム・お問い合わせフォームなど）はバンドルに含まれません。

## セットアップ

```bash
npm install
```

## 廉価版

### ローカルで確認

APIサーバーは不要です。

1. ポート5173を使っているプロセスがないか確認します。フル版の `npm run dev` が別のターミナルで動いていたら、先に止めてください（止め方は「[開発サーバーの起動と停止](#開発サーバーの起動と停止)」を参照）。

   ```bash
   lsof -i :5173    # 何も表示されなければ空いている
   ```

2. 廉価版を起動し、`ready in ...ms` と表示されるまで待ちます。初回や設定変更後は `optimizer` の処理に数秒かかります。

   ```bash
   npm run dev:lite
   ```

3. ブラウザで http://localhost:5173 を開き、`Ctrl+Shift+R`（Macは `Cmd+Shift+R`）で強制再読み込みします。以前フル版を開いていたタブは、再読み込みするまでフル版の画面が残ります。

4. 次の表で、廉価版になっているか確認します。

### 廉価版になっているかの見分け方

デザインは共通なので、ヘッダーのメニューとニュースの件数で見分けます。

| 確認項目 | フル版 | 廉価版 |
|---|---|---|
| ヘッダーのメニュー | トップ / ニュース / 掲示板 / チャット / ゲーム / 企業情報 / お問い合わせ / ログイン | トップ / ニュース / 企業情報 / 採用情報 / お問い合わせ |
| ヘッダー右端 | ログイン | 🔍 / ☾ / EN のボタン |
| `/board`、`/game` を開いたとき | 掲示板、ゲームが表示される | 「ページが見つかりません」が表示される |
| お問い合わせページ | 入力フォームがある | フォームはなく、メールアドレスと電話番号が表示される |
| ニュースの件数 | APIから取得した件数（初期データは2件） | `src/editions/lite/news/` の日本語の記事数（初期データは7件） |
| ターミナルの起動表示 | `VITE v8.x.x  ready` | `VITE v8.x.x  lite  ready`（`lite` の表示が出る） |

強制再読み込みしてもヘッダーに「掲示板」や「ログイン」が出る場合は、5173番ポートで別のサーバー（フル版）が動いています。下の手順で止めてから起動し直してください。

### ビルド

```bash
npm run build:lite        # dist-lite/ に出力（事前HTML化・sitemap.xml・RSS まで行う）
npm run check:lite        # 公開前チェック（リンク切れ・仮の連絡先など）
npm run preview:lite      # ビルド結果をローカルで確認（http://localhost:4173）
```

`build:lite` は内部で次の3段階を順に実行します。

1. `vite build --mode lite` … ブラウザ用の JS・CSS を作る
2. `vite build --mode lite --ssr src/editions/lite/entry-server.jsx --outDir .ssr-lite` … HTML を作るための JS を作る
3. `node scripts/lite/prerender.mjs` … 全ページの HTML、`404.html`、`sitemap.xml`、`robots.txt`、`feed.xml` を作る

ニュースの Markdown に書き間違いがあると、3 で「どのファイルの何が違うか」を表示して止まります。

公開URL（canonical・sitemap.xml・SNS カードに使う）は、`deploy-lite.sh` が S3 の URL を自動で設定します。
独自ドメインで公開する場合は `.env.lite` の `VITE_SITE_URL` に書いてください。手元で `build:lite` しただけのときは仮の `https://www.example.com` になります。

### S3 にデプロイ

```bash
bash infra/scripts/deploy-lite.sh
# または
npm run deploy:lite
```

スクリプトは次の順に実行します。

1. 公開URLを S3 の URL に設定して、`npm run build:lite` で `dist-lite/` を作る
2. `npm run check:lite` で公開前チェックをする（エラーがあればここで止まり、アップロードしない）
3. S3バケット `gon-hp-lite-<アカウントID>` を作る（既にあればそのまま使う）
4. 静的ウェブサイトホスティングを有効にする。存在しないURLには `404.html` を返す
5. 誰でも読み取れるバケットポリシーを設定する
6. `dist-lite/` をアップロードする（`assets/` の JS・CSS は長期キャッシュ、HTML などはキャッシュなし。消した記事のページはバケットからも消える）

完了すると公開URL（`http://gon-hp-lite-<アカウントID>.s3-website.ap-northeast-3.amazonaws.com`）が表示されます。

バケット名やリージョンを変える場合:

```bash
LITE_BUCKET_NAME=my-site-bucket AWS_DEFAULT_REGION=ap-northeast-1 bash infra/scripts/deploy-lite.sh
```

### 削除

```bash
bash infra/scripts/destroy-lite.sh
```

`gon-hp-lite-<アカウントID>`（または `LITE_BUCKET_NAME` で指定した名前）のバケット1つだけを中身ごと削除します。確認には `y` か `yes` で答えます。

### 公開前に変更する箇所

公開までの作業（会社情報の差し替え・独自ドメイン・Google Search Console / Bing Webmaster Tools への登録）は、
チェックリスト [docs/TODO_LAUNCH.md](docs/TODO_LAUNCH.md) にまとめています。主なファイルは次のとおりです。

| 項目 | ファイル |
|------|---------|
| 社名・住所・代表者・電話・メール・受付時間・SNS・地図（今は架空のサンプル） | `src/content/company-profile.js` |
| 事業内容・導入事例・採用情報・企業理念などの文言 | `src/content/ja/*.js`・`src/content/en/*.js` |
| ニュース・コラム記事 | `src/editions/lite/news/*.md`・`src/editions/lite/columns/*.md` |
| SNS 共有カードの画像（1200×630） | `public/ogp.png` |
| 独自ドメインの公開URL | `.env.lite` の `VITE_SITE_URL` |
| 検索エンジンの所有権確認コード | `src/editions/lite/config.js` の `SEARCH_VERIFICATION` |
| ヘッダー・フッターのリンク | `src/editions/lite/config.js` |

> 公開URL（`VITE_SITE_URL`）なしで `npm run build:lite` したものは**確認用ビルド**です（全ページ noindex）。
> デプロイスクリプトは公開URLを自動で設定してビルドし、確認用ビルドのままでは公開しません。

### CloudFormation で構築する

CloudFormation テンプレート（`infra/cloudformation/lite-site.yaml`）1枚で、S3 版・CloudFront 版のどちらも作れます。

```bash
bash infra/cloudformation/deploy.sh                      # S3 版（HTTP）
USE_CLOUDFRONT=true bash infra/cloudformation/deploy.sh  # CloudFront 版（HTTPS）
bash infra/cloudformation/destroy.sh                     # 削除
```

AWS CLI のインストール・認証情報の設定から公開までの手順は [docs/CLOUDFORMATION_LITE.md](docs/CLOUDFORMATION_LITE.md) にまとめています。

### HTTPS・独自ドメインで公開する（CloudFront 版）

S3 だけの公開は HTTP のみです。HTTPS や独自ドメインが必要な場合、または組織のアカウントで S3 を公開できない場合は、CloudFront 版を使います。サーバー・DB は使いません。

```bash
bash infra/scripts/deploy-lite-cdn.sh          # CloudFront のドメイン（https://xxxx.cloudfront.net）で公開
npm run deploy:lite:cdn                        # 同じ

# 独自ドメインを使う場合（証明書は us-east-1 の ACM で事前に作成）
LITE_DOMAIN=www.example.co.jp \
LITE_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxx \
bash infra/scripts/deploy-lite-cdn.sh

bash infra/scripts/destroy-lite-cdn.sh         # 削除（GonHpLiteStack だけを消す）
```

作られるもの（CDK スタック `GonHpLiteStack`、定義は `infra/lib/lite-cdn-stack.ts`）:

- 非公開の S3 バケット `gon-hp-lite-cdn-<アカウントID>`（CloudFront だけが読める）
- CloudFront（HTTP は HTTPS に転送、セキュリティヘッダー付き、存在しないURLは `404.html`）
- URL をファイル名に直す CloudFront Function（`/company` → `/company/index.html`）

初回は CloudFront の URL が決まってから、その URL で作り直してもう一度アップロードするため、2回デプロイが走ります。
独自ドメインを使う場合は、完了時に表示される CloudFront のドメイン名を DNS に CNAME で登録してください。

### 自動デプロイ（GitHub Actions）

`.github/workflows/` に設定があります。プルリクエストでビルドと公開前チェック、`main` への push で自動デプロイします。
最初に AWS の IAM ロールと GitHub の Secret を設定する必要があります。手順は [docs/EDITING_LITE.md の「自動デプロイ」](docs/EDITING_LITE.md#自動デプロイgithub-actions) を参照してください。

### ニュースの追加・削除、文言の変更

ニュースの追加・削除や、企業情報などの文言の変更方法は [docs/EDITING_LITE.md](docs/EDITING_LITE.md) にまとめています。

### 公開できない場合

組織のAWSアカウントでは「ブロックパブリックアクセス」がアカウント単位で有効になっていることがあり、その場合は `deploy-lite.sh` の手順5で止まります。対処は次のどちらかです。

- AWS管理者にアカウント単位のブロックパブリックアクセスの解除を依頼する
- 上の CloudFront 版（`deploy-lite-cdn.sh`）を使う。バケットは非公開のままで公開できる

### 注意点

- S3のウェブサイトエンドポイントは HTTP のみです。HTTPS や独自ドメインが必要なら CloudFront 版を使います
- 全ページを事前にHTML化しているので、`/company` などを直接開いても HTTP 200 で返ります（S3 は `/company` を `/company/` に転送してから表示します）
- 公開URLを変えた（独自ドメインに移したなど）ときは、再ビルドして再デプロイしてください。sitemap.xml や SNS カードの URL はビルド時に埋め込まれます

## フル版

### ローカルで確認

ターミナルを2つ使います。

```bash
# ターミナル1: APIサーバー（ポート3001）
npm run server

# ターミナル2: フロントエンド
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

### APIの接続先

APIの接続先は `.env` ファイルで切り替えます。

| 環境 | 設定ファイル | API接続先 |
|------|-------------|-----------|
| ローカル開発 | `.env.local` | `http://localhost:3001` |
| AWS | `.env.aws` | API Gateway (ap-northeast-3) |

```bash
npm run dev:aws     # AWSのAPI Gatewayに接続して開発
```

独自のAPIエンドポイントを使う場合は `.env.local` を編集します（gitignore対象）。

```env
VITE_API_TARGET=http://your-custom-api:8080
```

### ビルド

```bash
npm run build       # dist/ に出力
npm run build:aws   # AWS接続設定でビルド
```

### AWS にデプロイ / 削除

```bash
bash infra/scripts/deploy.sh      # CDKで GonHpStack を構築
bash infra/scripts/seed-users.sh  # テストユーザー登録
bash infra/scripts/destroy.sh     # 削除（確認は "yes" とフル入力）
```

詳細は [`infra/README.md`](infra/README.md) と [`docs/TEARDOWN.md`](docs/TEARDOWN.md) を参照してください。

### テストアカウント

| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 管理者 | admin@fsi.co.jp | password |
| 一般 | user@fsi.co.jp | password |

## 開発サーバーの起動と停止

`npm run dev`・`npm run dev:lite`・`npm run server` は、止めるまで動き続けます。

### 正しい止め方

起動したターミナルで **`Ctrl+C`** を押します。

> **`Ctrl+Z` では止まりません。** `Ctrl+Z` はプロセスを一時停止するだけで、ポートを握ったままバックグラウンドに残ります。
> ターミナルに `[1]+ Stopped npm run dev:lite` のように表示されたら、一時停止の状態です。

### 一時停止（Ctrl+Z）してしまった場合

```bash
jobs        # 一時停止中のプロセスを一覧表示（例: [1]+ Stopped npm run dev:lite）
kill %1     # 番号 [1] のプロセスを終了（番号は jobs の表示に合わせる）
```

`fg` で前面に戻してから `Ctrl+C` で止めても同じです。

### 別のターミナルで動いているサーバーを止める

どのターミナルで起動したか分からないときは、ポート番号から探して終了します。

```bash
lsof -i :5173     # フロントエンド（Vite）を使っているプロセスを表示
lsof -i :3001     # APIサーバーを使っているプロセスを表示

kill <PID>        # 表示された PID を指定して終了
# まとめて終了する場合
lsof -ti :5173 | xargs kill
```

`lsof` がない環境では `fuser -k 5173/tcp` でも終了できます。

### サーバーを止めても画面が動いて見える理由

このサイトはSPA（シングルページアプリケーション）です。一度読み込んだページはブラウザの中で動くため、サーバーを止めても、開いているタブではページ移動やニュースの絞り込み検索ができてしまいます。

サーバーが止まっているかは、ブラウザで再読み込み（`F5`）して確認します。止まっていれば「このサイトにアクセスできません」と表示されます。

### よくある症状

| 症状 | 原因 | 対処 |
|---|---|---|
| `npm run dev:lite` したのにフル版の画面のまま | ブラウザが古い画面を表示している、または5173番で別のサーバーが動いている | `Ctrl+Shift+R` で強制再読み込み。直らなければ `lsof -i :5173` で確認して止める |
| 停止したのに `localhost:5173` が表示される | `Ctrl+Z` で一時停止しただけ、または開いたままのタブが動いている | `jobs` → `kill %1`。その後ブラウザで再読み込みして確認 |
| `Port 5173 is in use, trying another one...` と表示される | 5173番を別のプロセスが使っている | 表示された別ポート（5174など）で開くか、5173番のプロセスを止める |
| `EADDRINUSE: address already in use :::3001` | APIサーバーが既に動いている | そのまま使うか、`lsof -ti :3001 \| xargs kill` で止めてから起動し直す |

## npm scripts 一覧

| コマンド | 版 | 説明 |
|----------|----|------|
| `npm run dev` | フル | 開発サーバー起動（ローカルAPIに接続） |
| `npm run dev:aws` | フル | 開発サーバー起動（AWSのAPIに接続） |
| `npm run server` | フル | ローカルAPIサーバー起動（ポート3001） |
| `npm run build` | フル | ビルド → `dist/` |
| `npm run build:aws` | フル | AWS接続設定でビルド → `dist/` |
| `npm run preview` | フル | `dist/` をローカルで確認 |
| `npm run dev:lite` | 廉価 | 開発サーバー起動（API不要） |
| `npm run build:lite` | 廉価 | ビルド → `dist-lite/`（事前HTML化・sitemap.xml・RSS まで） |
| `npm run check:lite` | 廉価 | 公開前チェック（`--strict` を付けると注意もエラー扱い） |
| `npm run preview:lite` | 廉価 | `dist-lite/` をローカルで確認 |
| `npm run deploy:lite` | 廉価 | ビルド・チェックしてS3にデプロイ（HTTP） |
| `npm run deploy:lite:cdn` | 廉価 | ビルド・チェックして S3 + CloudFront にデプロイ（HTTPS、CDK） |
| `npm run deploy:lite:cfn` | 廉価 | CloudFormation でスタックを作り、ビルド・チェック・アップロード |
| `npm run lint` | 共通 | ESLint実行 |

## GitHub のアカウントを使い分ける

複数の GitHub アカウントを使っていて `git push` が 403 になる場合は、リモートの URL にユーザー名を入れると、このリポジトリでは常にそのアカウントが使われます。

```powershell
git remote set-url origin https://saekikoki@github.com/saekikoki/git-free.git
git push   # 初回だけブラウザでログイン画面が出る
```

詳しくは [docs/GIT_ACCOUNTS.md](docs/GIT_ACCOUNTS.md) を参照してください。
