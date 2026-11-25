# リソース安全削除手順

AWS利用料を抑えるため、動作確認後にリソースを安全に削除する手順です。
**他のプロジェクトのリソースを誤って削除しないための確認手順を含みます。**

---

## ステップ0: 事前確認（削除前に必ず実施）

### 0-1. 今どのAWSアカウントに接続しているか確認

```bash
aws sts get-caller-identity
```

`Account` の値が、デプロイしたアカウント（例: `412381769521`）と一致することを確認します。

### 0-2. gon-hp のスタックが存在するか確認

```bash
aws cloudformation describe-stacks --stack-name GonHpStack --region ap-northeast-3 --query "Stacks[0].StackName"
```

`"GonHpStack"` と表示されればOKです。

### 0-3. 削除される予定のリソースを事前確認

```bash
cd infra
npx cdk diff GonHpStack
```

`[-]` の付いたリソースが削除対象です。gon-hp 関連のみであることを目視で確認します。

---

## ステップ1: CloudFrontとLambda等の削除（スタック削除）

スタック名を **明示的に指定** して削除します（`--all` を使わないことで誤削除を防止）。

```bash
cd infra
npx cdk destroy GonHpStack
```

`Are you sure you want to delete: GonHpStack (y/n)?` と聞かれるので `y` を入力。

これで以下が削除されます:
- API Gateway (`gon-hp-api`)
- Lambda 12関数
- Lambda実行ロール
- S3バケット (`gon-hp-frontend-*`)
- CloudFront ディストリビューション

**DynamoDBテーブルは RETAIN 設定のため残ります**（次のステップで削除）。

---

## ステップ2: DynamoDBテーブルの削除（任意）

データも含めて完全に消す場合のみ実施します。

### 2-1. 削除対象のテーブルが gon-hp のものか確認

```bash
aws dynamodb list-tables --region ap-northeast-3 --query "TableNames[?starts_with(@, 'gon-hp')]"
```

`gon-hp-users`, `gon-hp-news`, `gon-hp-board`, `gon-hp-contact` の4つだけが表示されることを確認します。

### 2-2. 1テーブルずつ削除

```bash
aws dynamodb delete-table --table-name gon-hp-users   --region ap-northeast-3
aws dynamodb delete-table --table-name gon-hp-news    --region ap-northeast-3
aws dynamodb delete-table --table-name gon-hp-board   --region ap-northeast-3
aws dynamodb delete-table --table-name gon-hp-contact --region ap-northeast-3
```

※テーブル名を明示指定しているので、他プロジェクトのテーブルには影響しません。

---

## ステップ3: 削除完了の確認

### 3-1. スタックが消えたか

```bash
aws cloudformation list-stacks --region ap-northeast-3 --query "StackSummaries[?StackStatus!='DELETE_COMPLETE'].StackName"
```

`GonHpStack` が一覧にないことを確認します。

### 3-2. DynamoDBテーブルが消えたか（ステップ2実施時）

```bash
aws dynamodb list-tables --region ap-northeast-3 --query "TableNames[?starts_with(@, 'gon-hp')]"
```

空 `[]` になっていればOKです。

### 3-3. S3バケットが消えたか

```bash
aws s3 ls --region ap-northeast-3 | grep gon-hp
```

何も表示されなければOKです。

---

## 残しても問題ないもの

以下は削除しなくても料金がほぼ発生しません。他のCDK作業で使うため残すことを推奨します。

| リソース | 理由 |
|----------|------|
| `CDKToolkit` スタック | 他のCDKプロジェクトと共有。S3に数KBのみで無料枠内 |

どうしても消したい場合:
```bash
aws cloudformation delete-stack --stack-name CDKToolkit --region ap-northeast-3
```

---

## 誤削除を防ぐ3つのルール

1. **`--all` ではなく `GonHpStack` を明示指定する**
2. **削除前に必ず `cdk diff` で対象を目視確認する**
3. **DynamoDB削除は `list-tables` で gon-hp 4つだけを確認してから実行する**

---

## 料金の目安（削除しなかった場合）

| リソース | 残した場合の月額 |
|----------|----------------|
| CloudFront | アクセスなしなら ほぼ0円 |
| Lambda | 呼び出しなしなら 0円 |
| API Gateway | 呼び出しなしなら 0円 |
| DynamoDB (オンデマンド) | データ数MBで 数円 |
| S3 | データ数MBで 数円 |

**動作確認だけなら数円〜数十円程度**ですが、確実にゼロにするなら上記手順で削除してください。
