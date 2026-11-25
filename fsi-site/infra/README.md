# gon-hp AWS インフラストラクチャ

> このドキュメントは **フル版**（CDK）の手順です。
> S3だけで動く **廉価版** は `scripts/deploy-lite.sh` / `scripts/destroy-lite.sh` を使います。手順はルートの `README.md` を参照してください。

## 概要

AWS CDK (Cloud Development Kit) を使って、コーポレートサイトの全インフラを1コマンドで構築できます。
全リソースは `gon-hp` プレフィックス、スタック名は `GonHpStack` で統一しています。

## 構築されるリソース

| サービス | リソース | 用途 |
|----------|----------|------|
| DynamoDB | gon-hp-users | ユーザー認証 |
| DynamoDB | gon-hp-news | ニュース記事 |
| DynamoDB | gon-hp-board | 掲示板スレッド |
| DynamoDB | gon-hp-contact | お問い合わせ |
| Lambda | 12関数（gon-hp-*） | 各APIエンドポイント |
| API Gateway | gon-hp-api | バックエンドAPI |
| S3 | gon-hp-frontend-{アカウントID} | フロントエンド配信 |
| CloudFront | CDN配信 | HTTPS + キャッシュ |

## 前提条件

以下がインストール・設定済みであること:

1. **Node.js 20以上**
2. **AWS CLI** — `aws configure` で認証情報を設定済み
3. **npm**

```bash
# AWS CLIの設定確認
aws sts get-caller-identity
```

## デプロイ方法

### ワンコマンドデプロイ

```bash
chmod +x infra/scripts/deploy.sh
bash infra/scripts/deploy.sh
```

これだけで以下が全て実行されます:
1. フロントエンドのビルド (`npm run build`)
2. CDK依存パッケージのインストール
3. CDK Bootstrap（初回のみ）
4. GonHpStack のデプロイ

### 初期ユーザー登録

デプロイ完了後、テストアカウントを登録します:

```bash
chmod +x infra/scripts/seed-users.sh
bash infra/scripts/seed-users.sh
```

## 手動デプロイ（ステップバイステップ）

```bash
# 1. フロントエンドビルド
npm run build

# 2. CDKディレクトリへ移動
cd infra

# 3. 依存パッケージインストール
npm install

# 4. CDK Bootstrap（初回のみ）
npx cdk bootstrap

# 5. デプロイ（スタック名を明示指定）
npx cdk deploy GonHpStack
```

## その他のコマンド

```bash
cd infra

# 差分確認（デプロイ前にどんな変更があるか確認）
npx cdk diff GonHpStack

# テンプレート出力（CloudFormation YAMLを確認）
npx cdk synth GonHpStack

# リソース削除（GonHpStack のみ / DynamoDBは任意で削除）
chmod +x scripts/destroy.sh
bash scripts/destroy.sh
```

> 削除の詳しい手順は [`docs/TEARDOWN.md`](../docs/TEARDOWN.md) を参照してください。

## デプロイ後の出力

デプロイ完了後、以下が表示されます:

```
Outputs:
GonHpStack.ApiUrl = https://xxxxxxxxxx.execute-api.ap-northeast-3.amazonaws.com/prod/
GonHpStack.CloudFrontUrl = https://dxxxxxxxxxx.cloudfront.net
GonHpStack.S3BucketName = gon-hp-frontend-123456789012
```

- **CloudFrontUrl** — ブラウザでアクセスするURL
- **ApiUrl** — API Gatewayのエンドポイント（CloudFront経由でアクセスするので直接使わない）

## フロントエンドの再デプロイ（コードだけ更新）

インフラは変えずにフロントのコードだけ更新したい場合:

```bash
# フロントをビルド
npm run build

# CDKで再デプロイ（S3のファイルが更新される）
cd infra
npx cdk deploy GonHpStack
```

## リージョン変更

デフォルトは `ap-northeast-3`（大阪）です。変更するには:

```bash
export CDK_DEFAULT_REGION=ap-northeast-1  # 東京に変更
bash infra/scripts/deploy.sh
```

## テストアカウント（seed-users.sh で登録）

| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 管理者 | admin@fsi.co.jp | password |
| 一般 | user@fsi.co.jp | password |

## コスト目安

月額 3,000〜5,000円（公開サイト、WAFなし、中規模トラフィック）

## トラブルシューティング

### "CDK Bootstrap が必要" エラー
```bash
cd infra
npx cdk bootstrap
```

### "Access Denied" エラー
AWS CLIの認証情報を確認:
```bash
aws sts get-caller-identity
```

### "already exists" エラー（過去の失敗デプロイの残骸）
過去に途中まで作られた Lambda / スタックが残っている場合は、
一度クリーンアップしてから再デプロイしてください（[`docs/TEARDOWN.md`](../docs/TEARDOWN.md) 参照）。

### フロントが表示されない
`dist/` ディレクトリが存在するか確認:
```bash
ls dist/
```
なければビルドを実行:
```bash
npm run build
```
