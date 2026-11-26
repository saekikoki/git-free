# 廉価版の編集ガイド

廉価版（S3 静的ホスティングのみ）の内容を変更する方法をまとめています。
管理画面やデータベースはないので、**ファイルを編集 → 再ビルド → 再デプロイ**という流れで更新します。

## 更新の基本の流れ

1. 下記の該当ファイルを編集する
2. （任意）`npm run dev:lite` を起動したまま編集すると、保存のたびにブラウザへ反映され、見た目を確認できる
3. `npm run build:lite` でビルドする（出力先は `dist-lite/`）
4. `npm run check:lite` で公開前チェックをする（リンク切れなどがあれば教えてくれる）
5. `bash infra/scripts/deploy-lite.sh`（HTTPS が必要なら `deploy-lite-cdn.sh`）を実行して公開する

確認だけしたい場合は `npm run preview:lite`（http://localhost:4173）で、公開するものと同じ表示を見られます。

> デプロイスクリプトは 3〜4 を自動で行います。チェックでエラーが出るとアップロードせずに止まります。

## 公開前に変更する項目

公開までの作業は [TODO_LAUNCH.md](TODO_LAUNCH.md) にチェックリストでまとめています。主なものは次のとおりです。

| 項目 | ファイル | 初期値 |
|------|---------|--------|
| **会社の基本情報**（社名・ロゴの文字・住所・代表者・設立日・電話・メール・受付時間・SNS・地図の場所） | `src/content/company-profile.js` | 架空のサンプル |
| 公開URL（独自ドメインの場合のみ） | `.env.lite` の `VITE_SITE_URL` | 空（デプロイ時に自動設定） |
| 検索エンジンの所有権確認コード | `src/editions/lite/config.js` の `SEARCH_VERIFICATION` | 空 |
| SNS で共有したときの画像 | `public/ogp.png`（1200×630 の PNG に差し替え） | サイト名入りの画像 |
| ヘッダー・フッターのリンク | `src/editions/lite/config.js` | |

`npm run check:lite` は、メールアドレス・電話番号・会社情報がサンプルのままだと「注意」を表示します。

### 会社の基本情報（company-profile.js）

社名や住所などは、**このファイル1つ**を書き換えれば、ヘッダー・フッター・企業情報・お問い合わせ・個人情報保護方針・
よくある質問・検索エンジン向けの会社情報・求人の勤務地に、まとめて反映されます。

```js
export default {
  siteName: "FSI-STYLE CORP",                       // サイト名（タブ・検索結果に出る）
  brand: { main: "FSI-STYLE", accent: "CORP" },     // ロゴの文字
  legalName: { ja: "株式会社エフエスアイスタイル", en: "FSI-STYLE Corporation" },
  address: { postalCode: "100-0000", region: { ja: "東京都", ... }, ... },
  email: "info@example.com",
  phone: "03-0000-0000",
  sns: { x: "", facebook: "", linkedin: "", youtube: "" },  // URL を入れたものだけフッターに出る
  ...
};
```

## 検索エンジン対策（SEO）のために気をつけること

ビルド時に、ページごとの HTML・sitemap.xml・構造化データなどは自動で作られます。中身を書くときは次の点に気をつけてください。

- **ページのタイトル（title）と説明（description）に、検索してほしい言葉を入れる**
  - 例: 事業内容なら「クラウド移行」「システム開発」など。日本語のタイトルは30文字前後、説明は120文字前後が目安
  - トップページのタイトルは `src/content/ja/home.js` の `title`
- **1ページに1つのテーマ**。事業・事例・求人は1件ずつ別ページになるので、それぞれ具体的に書く
- **記事は定期的に追加する**（ニュース・コラム）。古くなった情報は `updated:`（更新日）を付けて直す
- **画像には説明を付ける**（Markdown の `![ここに説明](/images/...)`）
- **サイト内リンクは `/company/` のように末尾に / を付ける**（Markdown では自動で付く）
- `npm run check:lite` の「注意」（タイトルが長すぎる、見出しが2つある など）は、できるだけなくす

## ニュースの追加・削除

ニュースは `src/editions/lite/news/` に **1記事 = 1つの Markdown ファイル**で置きます。

### 追加

`src/editions/lite/news/` に新しいファイルを作ります。ファイル名がそのまま記事のURLになります。

- ファイル名の例: `2025-08-01-new-office.md` → URL は `/news/2025-08-01-new-office`
- ファイル名には **半角英小文字・数字・ハイフン(-)** だけを使ってください（日本語や空白は不可）

中身は、先頭に `---` で囲んだ設定を書き、その下に本文を書きます。

```markdown
---
title: 新オフィス開設のお知らせ
category: お知らせ
date: 2025-08-01
summary: 一覧や検索結果、SNS で共有したときに出る短い説明（省略可）
---
本文はここから書きます。空行で段落が分かれます。

## 見出し

- 箇条書き
- **太字** や [リンク](/company) も使えます
```

| 項目 | 必須 | 説明 |
|------|------|------|
| `title` | ○ | 見出し |
| `category` | ○ | 「お知らせ」「製品」「組織」「IR」など。同じ名前の記事が一覧の絞り込みボタンになる |
| `date` | ○ | 公開日。`2025-08-01` の形式 |
| `summary` | | 短い説明。省略すると本文の先頭が使われる |
| `image` | | 記事の先頭に出す画像（例: `/images/news/office.jpg`。画像は `public/images/news/` に置く） |

本文で使える主な書き方（Markdown）:

| 書き方 | 表示 |
|------|------|
| `## 見出し` | 見出し |
| `- 項目` | 箇条書き |
| `**文字**` | 太字 |
| `[文字](/company)` | リンク（サイト内は `/` から始める） |
| `![説明](/images/news/photo.jpg)` | 画像 |
| `\| 項目 \| 値 \|` の表 | 表（`2025-05-12-fy2024-results.md` を参考に） |

### 英語版を付ける（任意）

同じ名前に `.en` を付けたファイルを作ると、英語ページ（`/en/news/...`）ではそちらが表示されます。

```markdown
---
title: Opening of Our New Office
summary: Short description (optional)
---
English body here.
```

英語版のファイルがない記事は、英語ページを作りません（日本語と同じ中身のページが2つできると、検索エンジンに重複とみなされるため）。
英語の一覧には「Japanese」の目印付きで表示され、押すと日本語のページが開きます。
`category` と `date` は日本語版のものが使われます。カテゴリの英語名は `src/content/en/common.js` の `news.categories` で設定します。

### 内容を更新したとき

記事を直したら、先頭の設定に `updated:`（更新日）を足します。記事に「更新」の日付が表示され、検索エンジンにも更新を伝えます。

```markdown
---
title: 夏季休業のお知らせ
category: お知らせ
date: 2025-06-10
updated: 2025-07-05
---
```

## コラムの追加・削除

コラム（`/columns/`）は `src/editions/lite/columns/` に置きます。書き方はニュースとまったく同じで、次の項目も使えます。

| 項目 | 説明 |
|------|------|
| `author` | 執筆者・執筆部署（例: `クラウド事業部`）。記事の見出しの下に表示される |

検索で見つけてもらうための記事なので、「お客様が困っていること」をタイトルにし（例:「クラウド移行を失敗させない5つのステップ」）、
本文の最後に関連する事業内容や導入事例へのリンクを入れると効果的です。

### 削除

記事のファイル（英語版があればそれも）を削除します。次のデプロイで、そのページは公開サイトからも消えます。

### 書き間違えたとき

`title` がない、日付の形式が違う、ファイル名に日本語が入っている、などの間違いがあると、
`npm run build:lite` が **どのファイルの何が間違っているか** を表示して止まります（公開はされません）。

### 自動で更新されるもの

記事を追加・削除してビルドすると、次も自動で作り直されます。手で直す必要はありません。

- トップページの最新ニュース（新しい5件）、一覧ページ、関連ニュース、前後の記事
- サイト内検索の対象
- `sitemap.xml`（検索エンジン向けのページ一覧）
- RSS フィード（`/feed.xml`・`/en/feed.xml`）

## 企業情報などの文言の変更

画面に出る文言は、**言語ごとのファイル**にまとめています。日本語は `src/content/ja/`、英語は `src/content/en/` です。
両方に同じ名前のファイルがあり、中の項目名（`title:` など）もそろえています。

> これらのファイルはフル版と共通です。日本語の文言を変えるとフル版にも反映されます。

| 変更したい内容 | 日本語 | 英語 |
|------|---------|------|
| 社名・住所・連絡先など（両方の言語で共通） | `src/content/company-profile.js` | 同左 |
| トップ（タイトル・見出し・実績の数字） | `src/content/ja/home.js` | `src/content/en/home.js` |
| 事業内容（トップのカード・一覧・各事業の詳細ページ） | `src/content/ja/services.js` | `src/content/en/services.js` |
| 導入事例（トップのスライド・一覧・各事例の詳細ページ） | `src/content/ja/cases.js` | `src/content/en/cases.js` |
| 企業情報（理念・数字・会社概要・役員・沿革・アクセス） | `src/content/ja/company.js` | `src/content/en/company.js` |
| 採用情報（職種と各職種の詳細ページ・社員インタビュー・福利厚生・選考フロー） | `src/content/ja/recruit.js` | `src/content/en/recruit.js` |
| よくある質問 | `src/content/ja/faq.js` | `src/content/en/faq.js` |
| お問い合わせページ | `src/content/ja/contact.js` | `src/content/en/contact.js` |
| 個人情報保護方針・利用規約 | `src/content/ja/legal.js` | `src/content/en/legal.js` |
| ヘッダー・フッター・ニュース画面のボタン名など | `src/content/ja/common.js` | `src/content/en/common.js` |
| サイト内検索ページ | `src/content/ja/search.js` | `src/content/en/search.js` |
| メニューのリンク名 | `src/editions/lite/config.js`（`label` が日本語、`labelEn` が英語） | 同左 |

### 編集のコツ

- `"..."` の中の文字だけを書き換え、項目名（`title:` など）やカッコ・カンマは触らない
- 改行したいところには `\n` を書く（例: `"1行目\n2行目"`）
- 項目を増やすときは、同じ形の `{ ... },` をコピーして中身を書き換える（例: FAQ の質問、沿革の年、採用の職種）
- 採用の職種の `category` と `types` は、`filters` に書いた名前と同じにする（絞り込みボタンと対応させるため）
- 企業情報の地図の場所は `company-profile.js` の `mapQuery`（Google マップで検索する住所）で変える
- 事業・事例・職種を足すときは `slug`（URL になる英小文字の名前）を付け、日本語と英語で同じ `slug` にする。
  新しい `slug` のページはビルド時に自動で作られ、sitemap.xml にも載る
- 事業内容の `relatedCases`、導入事例の `service` には、関連する相手の `slug` を書く（詳細ページで互いにリンクされる）
- 職種には Google の求人検索用の項目（`employmentType`・`salary`・`datePosted`）がある。締め切った職種は消す
- 新しい文言ファイル（`src/content/ja/xxx.js`）を作ったときは、`src/content/index.js` の `CONTENT_NAMES` と、
  使うページの `src/editions/lite/routes.js` の `content` に名前を足す
- 日本語を変えたら、英語のファイルも合わせて直す
- 書き換えたあと `npm run dev:lite` の画面で崩れていないか確認する
- 見た目（色・余白など）を変えたい場合は `src/styles/` 配下の CSS を編集する（ダークモードの色は `src/styles/dark.css`）

## 自動デプロイ（GitHub Actions）

GitHub にリポジトリを置くと、次の2つが自動で動きます（設定ファイルは `.github/workflows/`）。

| ファイル | いつ動くか | 何をするか |
|------|------|------|
| `lite-check.yml` | プルリクエストを作ったとき | ビルドと公開前チェック（AWS には接続しない） |
| `lite-deploy.yml` | `main` ブランチに push したとき | ビルド・チェック・S3（または CloudFront）へのデプロイ |

### 準備（最初の1回だけ）

1. AWS の IAM で「GitHub の OIDC プロバイダー」（`token.actions.githubusercontent.com`）を登録する
2. そのプロバイダーを信頼する IAM ロールを作る。信頼ポリシーの条件で、自分のリポジトリだけに限定する
   （例: `"token.actions.githubusercontent.com:sub": "repo:<組織名>/<リポジトリ名>:ref:refs/heads/main"`）
3. ロールに必要な権限を付ける
   - S3 版: `gon-hp-lite-<アカウントID>` バケットの作成・設定・読み書き
   - CloudFront 版: CDK のデプロイ権限（`cdk-*` ロールを引き受ける権限）
4. GitHub のリポジトリ設定 → Secrets and variables → Actions で次を登録する

| 種類 | 名前 | 値 |
|------|------|------|
| Secret | `AWS_ROLE_ARN` | 手順2のロールの ARN |
| Variable（任意） | `LITE_DEPLOY_MODE` | `s3`（既定）または `cdn` |
| Variable（任意） | `AWS_REGION` | 既定は `ap-northeast-3` |
| Variable（任意） | `VITE_SITE_URL` | 独自ドメインで公開する場合の URL |
| Variable（任意） | `LITE_DOMAIN` / `LITE_CERT_ARN` | CloudFront 版で独自ドメインを使う場合 |

アクセスキーを GitHub に保存する必要はありません（OIDC で一時的な認証情報を受け取ります）。
