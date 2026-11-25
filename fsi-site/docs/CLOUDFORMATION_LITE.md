# 廉価版を CloudFormation で構築する

廉価版（サーバー・DB なし）の AWS 環境を、CloudFormation テンプレートで作る手順です。
AWS CLI のインストールから、シェルを1回実行してサイトが公開されるまでを説明します。

| ファイル | 内容 |
|------|------|
| `infra/cloudformation/lite-site.yaml` | CloudFormation テンプレート（AWS に作るものの定義） |
| `infra/cloudformation/deploy.sh` | テンプレートの適用 → ビルド → アップロードまでを一度に行うスクリプト |
| `infra/cloudformation/destroy.sh` | 作ったものをすべて削除するスクリプト |

## 作られるもの

配信方法を2種類から選べます（`USE_CLOUDFRONT` で切り替え）。

| | S3 版（既定） | CloudFront 版 |
|---|---|---|
| 指定 | `USE_CLOUDFRONT=false` | `USE_CLOUDFRONT=true` |
| URL | `http://gon-hp-lite-cfn-<アカウントID>.s3-website.ap-northeast-3.amazonaws.com` | `https://xxxx.cloudfront.net`（または独自ドメイン） |
| HTTPS | なし | あり（http は https に転送） |
| 独自ドメイン | 使えない | 使える（us-east-1 の ACM 証明書が必要） |
| S3 バケット | 公開（読み取りのみ） | 非公開（CloudFront だけが読める） |
| 組織のアカウントで S3 の公開が禁止されている場合 | 使えない | 使える |
| 構築時間 | 1分程度 | 初回 5〜15 分 |
| 月額の目安 | 数円〜数十円 | 数円〜数百円（CloudFront には毎月の無料枠がある） |

AWS に作られるリソース:

| リソース | 名前 | S3 版 | CloudFront 版 |
|------|------|:---:|:---:|
| CloudFormation スタック | `gon-hp-lite-cfn` | ○ | ○ |
| S3 バケット | `gon-hp-lite-cfn-<アカウントID>` | ○ | ○ |
| S3 バケットポリシー | （バケットに付く） | ○ 誰でも読める | ○ CloudFront だけ読める |
| CloudFront ディストリビューション | — | | ○ |
| CloudFront Function | `gon-hp-lite-cfn-rewrite`（`/company` → `/company/index.html`） | | ○ |
| Origin Access Control | `gon-hp-lite-cfn-oac` | | ○ |

> 名前に `-cfn` を付けているので、`deploy-lite.sh`（バケット `gon-hp-lite-<アカウントID>`）や
> `deploy-lite-cdn.sh`（CDK のスタック `GonHpLiteStack`）で作ったものとは別物になり、ぶつかりません。

---

## 手順0: 前提

このプロジェクトは **WSL（Ubuntu）** の中でビルドします（`node_modules` が WSL 側に入っているため）。
以下のコマンドはすべて **WSL のターミナル**で実行してください。

- Windows のスタートメニューから「Ubuntu」を開く（または PowerShell で `wsl` と入力）
- Node.js 20 以上が入っていること（`node -v` で確認）

プロジェクトのフォルダに移動します。

```bash
cd "/mnt/c/Users/saekikok/OneDrive - FUJISOFT INCORPORATED/ドキュメント/Azure/test/git-free/fsi-site"
```

## 手順1: AWS CLI をインストールする

```bash
sudo apt update
sudo apt install -y unzip curl
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
sudo /tmp/aws/install
aws --version          # aws-cli/2.x.x と表示されれば成功
```

すでに入っていて更新したい場合は、最後の `install` を `sudo /tmp/aws/install --update` にします。

## 手順2: AWS の認証情報を設定する

### 2-1. IAM ユーザーとアクセスキーを用意する

AWS マネジメントコンソールで作業します（すでにアクセスキーがあれば 2-2 へ）。

1. **IAM** → **ユーザー** → **ユーザーの作成**。名前は例えば `gon-hp-lite-deployer`
2. **ポリシーを直接アタッチ** → **ポリシーの作成** で、下の「必要な権限」を JSON で貼り付けて作成し、アタッチする
3. 作ったユーザー → **セキュリティ認証情報** → **アクセスキーを作成** → 用途は「コマンドラインインターフェイス (CLI)」
4. 表示された **アクセスキー ID** と **シークレットアクセスキー** を控える（シークレットはこの画面でしか見られない）

> アクセスキーは他人に渡したり、Git にコミットしたりしないでください。
> 組織で IAM Identity Center（SSO）を使っている場合は、アクセスキーの代わりに `aws configure sso` で設定できます。

必要な権限（このテンプレートで作るものだけに絞った例）:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFormationStack",
      "Effect": "Allow",
      "Action": "cloudformation:*",
      "Resource": "arn:aws:cloudformation:*:*:stack/gon-hp-lite-cfn/*"
    },
    {
      "Sid": "CloudFormationRead",
      "Effect": "Allow",
      "Action": ["cloudformation:ValidateTemplate", "cloudformation:ListStacks"],
      "Resource": "*"
    },
    {
      "Sid": "SiteBucket",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::gon-hp-lite-cfn-*", "arn:aws:s3:::gon-hp-lite-cfn-*/*"]
    },
    {
      "Sid": "CloudFront",
      "Effect": "Allow",
      "Action": "cloudfront:*",
      "Resource": "*"
    }
  ]
}
```

S3 版しか使わないなら、`CloudFront` の部分は不要です。

### 2-2. AWS CLI に登録する

```bash
aws configure
```

聞かれた順に入力します。

```
AWS Access Key ID [None]:     （控えたアクセスキー ID）
AWS Secret Access Key [None]: （控えたシークレットアクセスキー）
Default region name [None]:   ap-northeast-3
Default output format [None]: json
```

設定できたか確認します。自分のアカウント ID が表示されれば成功です。

```bash
aws sts get-caller-identity
```

## 手順3: 公開前に変える項目を直す

最低限、お問い合わせ先を実際の値にします（`src/editions/lite/config.js`）。

```js
export const CONTACT_EMAIL = "info@example.com";   // ← 実際のメールアドレス
export const CONTACT_PHONE = "03-0000-0000";       // ← 実際の電話番号
```

ほかの変更箇所は [README の「公開前に変更する箇所」](../README.md#公開前に変更する箇所) を参照してください。
そのままでもデプロイはできます（チェックで「注意」が表示されるだけです）。

## 手順4: シェルを実行してリソースを構築する

初回だけ、ライブラリを入れます（すでに入っていれば不要）。

```bash
npm install
```

### S3 版（HTTP）

```bash
bash infra/cloudformation/deploy.sh
# または
npm run deploy:lite:cfn
```

### CloudFront 版（HTTPS）

```bash
USE_CLOUDFRONT=true bash infra/cloudformation/deploy.sh
```

### CloudFront 版 + 独自ドメイン

先に、**us-east-1（バージニア北部）** の ACM でドメインの証明書を作り、検証を済ませておきます。

```bash
USE_CLOUDFRONT=true \
LITE_DOMAIN=www.example.co.jp \
LITE_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx \
bash infra/cloudformation/deploy.sh
```

完了時に表示される CloudFront のドメイン名を、DNS に CNAME で登録してください。

### スクリプトが行うこと

1. `lite-site.yaml` で CloudFormation スタック `gon-hp-lite-cfn` を作る（2回目以降は差分だけ更新）
2. スタックの出力から、公開URLとバケット名を受け取る
3. その公開URLで廉価版をビルドする（`npm run build:lite`。sitemap.xml や SNS カードに URL が入る）
4. 公開前チェックをする（`npm run check:lite`）。エラーがあればここで止まり、アップロードしない
5. `dist-lite/` を S3 にアップロードする
6. CloudFront 版なら、CloudFront のキャッシュを消す

最後に次のように表示されれば完了です。表示された URL をブラウザで開いて確認してください。

```
[CFN-LITE] ============================================
[CFN-LITE]  廉価版（CloudFormation 版）のデプロイ完了
[CFN-LITE] ============================================
[CFN-LITE] URL: http://gon-hp-lite-cfn-123456789012.s3-website.ap-northeast-3.amazonaws.com
```

## 手順5: 内容を更新する

ニュースや文言を変えたら（変え方は [EDITING_LITE.md](EDITING_LITE.md)）、**手順4と同じコマンドをもう一度実行**するだけです。
スタックに変更がなければ CloudFormation は何もせず、ビルドとアップロードだけが行われます。

> S3 版と CloudFront 版を切り替えると公開URLが変わります。最初に決めた方を使い続けてください。

## 手順6: 削除する

```bash
bash infra/cloudformation/destroy.sh
```

確認に `y` か `yes` と答えると、バケットの中身を空にしてから、スタックで作ったものをすべて削除します。
他の方法で作った廉価版やフル版には影響しません。

---

## 状態を確認する

```bash
# スタックの状態と出力（公開URLなど）
aws cloudformation describe-stacks --stack-name gon-hp-lite-cfn --region ap-northeast-3

# 直近の作業履歴（失敗したときは、ここに理由が出る）
aws cloudformation describe-stack-events --stack-name gon-hp-lite-cfn --region ap-northeast-3 --max-items 15
```

マネジメントコンソールでは、**CloudFormation** → **スタック** → `gon-hp-lite-cfn` で確認できます。

## スクリプトを使わずにテンプレートだけ使う場合

テンプレートの適用とアップロードは、次のコマンドでもできます（スクリプトの中身と同じ流れ）。

```bash
# 1. テンプレートを適用
aws cloudformation deploy \
  --stack-name gon-hp-lite-cfn \
  --template-file infra/cloudformation/lite-site.yaml \
  --parameter-overrides UseCloudFront=false \
  --region ap-northeast-3

# 2. 公開URLとバケット名を確認
aws cloudformation describe-stacks --stack-name gon-hp-lite-cfn --region ap-northeast-3 \
  --query "Stacks[0].Outputs" --output table

# 3. その公開URLでビルドしてアップロード
VITE_SITE_URL=<SiteUrl の値> npm run build:lite
aws s3 sync dist-lite s3://<BucketName の値> --delete
```

マネジメントコンソールの **CloudFormation** → **スタックの作成** で `lite-site.yaml` をアップロードしてスタックを作ることもできます。
その場合も、ファイルのアップロード（3）は別に行う必要があります。

## うまくいかないとき

| 症状 | 原因と対処 |
|------|------|
| `$'\r': command not found` | スクリプトの改行コードが Windows 形式になっている。`sed -i 's/\r$//' infra/cloudformation/*.sh` で直す |
| `Unable to locate credentials` / `ExpiredToken` | 認証情報がない・期限切れ。手順2をやり直す（SSO の場合は `aws sso login`） |
| `AccessDenied` | IAM ユーザーの権限が足りない。手順2-1 の権限を確認する |
| S3 版で `SiteBucketPolicy` が `CREATE_FAILED`（`BlockPublicPolicy` / `Access Denied`） | アカウント単位で S3 の公開が禁止されている。CloudFront 版（`USE_CLOUDFRONT=true`）を使う |
| `... is in ROLLBACK_COMPLETE state and can not be updated` | 初回の作成に失敗して止まっている。`bash infra/cloudformation/destroy.sh` で消してから、原因を直して再実行 |
| `gon-hp-lite-cfn-... already exists` | 同じ名前のバケットが残っている。不要なら S3 のコンソールで削除してから再実行 |
| `DomainName を使う場合は ...` | 独自ドメインには `USE_CLOUDFRONT=true` と us-east-1 の証明書が必要 |
| CloudFront 版で古い内容が表示される | キャッシュの削除に数分かかる。少し待って `Ctrl+Shift+R` で再読み込み |
| `公開前チェックでエラーが見つかりました` | 表示されたリンク切れなどを直す。AWS には何もアップロードされていない |

## 他の構築方法との違い

廉価版の構築方法は3つあります。作られるものはほぼ同じなので、使い慣れたものを1つ選んでください。

| 方法 | コマンド | 特徴 |
|------|------|------|
| AWS CLI 直接 | `bash infra/scripts/deploy-lite.sh` | S3 版のみ。いちばん単純。スタックを作らない |
| **CloudFormation** | `bash infra/cloudformation/deploy.sh` | **このページ**。テンプレート1枚で S3 版・CloudFront 版の両方。作ったものがスタックにまとまるので、確認・削除が簡単 |
| CDK | `bash infra/scripts/deploy-lite-cdn.sh` | CloudFront 版のみ。TypeScript で書く。CDK の準備（bootstrap）が必要 |
