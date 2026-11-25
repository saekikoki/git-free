#!/bin/bash
# ============================================================
# 初期ユーザーデータ投入スクリプト
# ============================================================
# DynamoDB の gon-hp-users テーブルにテストアカウントを登録します。
# デプロイ後に1回実行してください。
#
# 使い方:
#   chmod +x infra/scripts/seed-users.sh
#   ./infra/scripts/seed-users.sh
# ============================================================

set -e

REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}
TABLE_NAME="gon-hp-users"

echo "[SEED] テストユーザーを ${TABLE_NAME} テーブルに登録中..."

# パスワード "password" の SHA-256 ハッシュ
PASSWORD_HASH="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"

# 管理者アカウント
aws dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --region "$REGION" \
  --item '{
    "email": {"S": "admin@fsi.co.jp"},
    "password": {"S": "'"$PASSWORD_HASH"'"},
    "role": {"S": "admin"}
  }'

echo "[SEED] admin@fsi.co.jp を登録しました（role: admin）"

# 一般ユーザーアカウント
aws dynamodb put-item \
  --table-name "$TABLE_NAME" \
  --region "$REGION" \
  --item '{
    "email": {"S": "user@fsi.co.jp"},
    "password": {"S": "'"$PASSWORD_HASH"'"},
    "role": {"S": "user"}
  }'

echo "[SEED] user@fsi.co.jp を登録しました（role: user）"
echo "[SEED] 完了！"
echo ""
echo "ログイン情報:"
echo "  管理者: admin@fsi.co.jp / password"
echo "  一般:   user@fsi.co.jp / password"
