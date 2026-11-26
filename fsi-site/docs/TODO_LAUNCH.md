# 公開までにやることメモ（廉価版）

サイトが完成したら、上から順に進めてください。終わったら `[ ]` を `[x]` にしておくと便利です。

## 1. 会社の情報を差し替える

今の会社情報・事例・社員インタビュー・求人はすべて**架空のサンプル**です。

- [ ] `src/content/company-profile.js` … 社名・住所・代表者・設立日・資本金・従業員数・電話・メール・SNS・地図の場所
- [ ] `src/content/ja/company.js`・`en/company.js` … 企業理念・数字・役員・沿革・取引銀行
- [ ] `src/content/ja/home.js`・`en/home.js` … トップの見出し・実績の数字・トップページのタイトル
- [ ] `src/content/ja/services.js`・`en/services.js` … 事業内容（実際のサービスに合わせる）
- [ ] `src/content/ja/cases.js`・`en/cases.js` … 導入事例（掲載の許可を取ったものだけ）
- [ ] `src/content/ja/recruit.js`・`en/recruit.js` … 募集職種・給与・社員インタビュー・福利厚生
- [ ] `src/content/ja/legal.js`・`en/legal.js` … 個人情報保護方針・利用規約（法務の確認を受ける）
- [ ] `src/editions/lite/news/`・`columns/` … サンプルの記事を消して、実際の記事に置き換える
- [ ] `public/ogp.png` … SNS 共有カードの画像（1200×630 の PNG）を自社のロゴ入りのものに差し替える
- [ ] `public/favicon.svg` … ブラウザのタブに出るアイコン

差し替えたら `npm run build:lite` → `npm run check:lite` を実行します。
「サンプルのまま」「仮の info@example.com のまま」などの注意が出なくなれば完了です。

## 2. 独自ドメインで公開する

- [ ] ドメインの証明書を **us-east-1（バージニア北部）** の ACM で作り、DNS 検証を済ませる
- [ ] `.env.lite` の `VITE_SITE_URL` に公開URLを書く（例: `VITE_SITE_URL=https://www.example.co.jp`）
- [ ] CloudFront 版でデプロイする（どちらか一方）
  - `USE_CLOUDFRONT=true LITE_DOMAIN=www.example.co.jp LITE_CERT_ARN=arn:aws:acm:us-east-1:... bash infra/cloudformation/deploy.sh`
  - `LITE_DOMAIN=www.example.co.jp LITE_CERT_ARN=arn:aws:acm:us-east-1:... bash infra/scripts/deploy-lite-cdn.sh`
- [ ] 完了時に表示される CloudFront のドメイン名を、DNS に CNAME で登録する
- [ ] ブラウザで `https://www.example.co.jp/` が表示されることを確認する
- [ ] `https://www.example.co.jp/company`（末尾の / なし）を開くと `/company/` に転送されることを確認する

> 独自ドメインに移す前に S3 の URL で公開していた場合は、S3 版のバケットを削除しておく（`bash infra/scripts/destroy-lite.sh`）。
> 同じ内容のサイトが2つの URL で見られると、検索エンジンの評価が分散します。

## 3. Google Search Console に登録する

Google の検索結果での表示回数・クリック数・検索された言葉が分かり、ページの登録をお願いすることもできます。

1. [ ] https://search.google.com/search-console を開き、Google アカウントでログインする
2. [ ] 「プロパティを追加」→ **URL プレフィックス** を選び、公開URL（`https://www.example.co.jp/`）を入力する
   - 「ドメイン」を選んで DNS の TXT レコードで確認する方法もある（サブドメインもまとめて管理できる）
3. [ ] 所有権の確認方法で **HTML タグ** を選び、表示された `<meta name="google-site-verification" content="XXXX">` の `XXXX` をコピーする
4. [ ] `src/editions/lite/config.js` の `SEARCH_VERIFICATION.google` に貼り付ける

   ```js
   export const SEARCH_VERIFICATION = {
     google: "XXXX",
     bing: "",
   };
   ```

5. [ ] デプロイし直してから、Search Console の「確認」を押す
6. [ ] 左のメニューの **サイトマップ** で `sitemap.xml` と入力して送信する（状態が「成功しました」になればよい）
7. [ ] **URL 検査** でトップページの URL を入れ、「インデックス登録をリクエスト」を押す
8. [ ] 数日〜2週間後に、次のレポートを確認する
   - **検索パフォーマンス** … どんな言葉で検索され、何回表示・クリックされたか
   - **ページ** … 登録されたページと、登録されなかったページの理由
   - **拡張**（求人情報・パンくずリスト など） … 構造化データにエラーがないか
   - **ウェブに関する主な指標** … 表示速度の評価

## 4. Bing Webmaster Tools に登録する

Bing と、Bing の検索結果を使う Yahoo! 以外のサービス（DuckDuckGo など）向けです。

1. [ ] https://www.bing.com/webmasters を開き、Microsoft アカウントなどでログインする
2. [ ] **Google Search Console からインポート** を選ぶ（手順3が終わっていれば、確認とサイトマップの送信がまとめて済む）
   - インポートしない場合は「サイトを手動で追加」→ 確認方法で **HTML メタタグ** を選び、
     `<meta name="msvalidate.01" content="YYYY">` の `YYYY` を `SEARCH_VERIFICATION.bing` に貼り付けてデプロイし直す
3. [ ] **サイトマップ** で `https://www.example.co.jp/sitemap.xml` を送信する（インポートした場合は不要）
4. [ ] 数日後に **検索パフォーマンス** を確認する

## 5. 公開後に続けること

- [ ] ニュース・コラムを定期的に追加する（月に1〜2本でも、更新が続いているサイトは巡回されやすい）
- [ ] 締め切った求人は `recruit.js` から消す（古い求人が残っていると、Google の求人検索で評価が下がる）
- [ ] 取引先・業界団体・SNS の公式アカウントから、サイトへのリンクを張ってもらう
- [ ] Search Console の「検索パフォーマンス」で、表示は多いのにクリックが少ないページのタイトル・説明文を見直す
- [ ] 数か月に1回、Lighthouse（Chrome の開発者ツール → Lighthouse）で表示速度を測る
