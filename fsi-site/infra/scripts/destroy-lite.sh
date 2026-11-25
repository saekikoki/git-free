#!/bin/bash
# ============================================================
# 廉価版 削除スクリプト
# ============================================================
# deploy-lite.sh で作ったS3バケット「1つだけ」を中身ごと削除します。
# バケット名を明示しているので、他のバケットには影響しません。
#
# 使い方:
#   bash infra/scripts/destroy-lite.sh
#   バケット名を変えてデプロイした場合: LITE_BUCKET_NAME=my-bucket bash infra/scripts/destroy-lite.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DESTROY-LITE]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null) \
  || error "AWS認証情報が設定されていません"
BUCKET=${LITE_BUCKET_NAME:-gon-hp-lite-${ACCOUNT_ID}}

log "AWSアカウント: ${ACCOUNT_ID}"
log "削除対象バケット: ${BUCKET}（このバケットのみ）"

if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  warn "${BUCKET} が見つかりません。既に削除済みの可能性があります。"
  exit 0
fi

read -p "バケット ${BUCKET} を中身ごと削除しますか？ (y/yes で削除): " confirm
case "$confirm" in
  y|Y|yes|YES) ;;
  *) log "キャンセルしました"; exit 0 ;;
esac

aws s3 rm "s3://${BUCKET}" --recursive
aws s3api delete-bucket --bucket "$BUCKET"

log "バケット ${BUCKET} を削除しました ✓"
