#!/bin/bash
# ============================================================
# gon-hp リソース安全削除スクリプト
# ============================================================
# GonHpStack のみを対象に削除します。
# スタック名を明示指定するため、他プロジェクトには影響しません。
#
# 使い方:
#   chmod +x infra/scripts/destroy.sh
#   ./infra/scripts/destroy.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DESTROY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

STACK_NAME="GonHpStack"
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}

# ============================================================
# 0. 事前確認: 接続先アカウントと対象スタック
# ============================================================
command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) || error "AWS認証情報が設定されていません"

log "接続先AWSアカウント: ${ACCOUNT_ID}"
log "リージョン: ${REGION}"
log "削除対象スタック: ${STACK_NAME}（このスタックのみ）"

# 対象スタックが存在するか確認
if ! aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" >/dev/null 2>&1; then
  warn "${STACK_NAME} が見つかりません。既に削除済みか、別リージョンの可能性があります。"
  exit 0
fi

echo ""
echo "============================================"
echo " 以下を削除します（GonHpStack のみ）:"
echo "   - API Gateway (gon-hp-api)"
echo "   - Lambda 12関数"
echo "   - S3バケット (gon-hp-frontend-*)"
echo "   - CloudFront ディストリビューション"
echo ""
echo " DynamoDBテーブルは RETAIN 設定のため残ります"
echo " （後でオプション削除できます）"
echo "============================================"
read -p "スタックを削除しますか？ (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  log "キャンセルしました"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.."

# ============================================================
# 1. スタック削除（スタック名を明示指定）
# ============================================================
log "${STACK_NAME} を削除中..."
npx cdk destroy "$STACK_NAME" --force

log "${STACK_NAME} を削除しました ✓"

# ============================================================
# 2. DynamoDBテーブルの削除（任意）
# ============================================================
echo ""
echo "============================================"
echo " DynamoDBテーブル（データ）も削除しますか？"
echo " 対象: gon-hp-users, gon-hp-news,"
echo "       gon-hp-board, gon-hp-contact"
echo "============================================"

# 念のため gon-hp のテーブルだけを表示して確認させる
log "現在の gon-hp テーブル一覧:"
aws dynamodb list-tables --region "$REGION" --query "TableNames[?starts_with(@, 'gon-hp')]" --output table || true

read -p "上記のDynamoDBテーブルを削除しますか？ (yes/no): " confirmDb

if [ "$confirmDb" = "yes" ]; then
  for table in gon-hp-users gon-hp-news gon-hp-board gon-hp-contact; do
    if aws dynamodb describe-table --table-name "$table" --region "$REGION" >/dev/null 2>&1; then
      aws dynamodb delete-table --table-name "$table" --region "$REGION" >/dev/null
      log "テーブル ${table} を削除しました ✓"
    fi
  done
else
  log "DynamoDBテーブルは残しました（データ保持）"
fi

# ============================================================
# 3. 完了
# ============================================================
log ""
log "============================================"
log " 削除完了"
log "============================================"
log "CDKToolkit スタックは他プロジェクト共用のため残しています。"
