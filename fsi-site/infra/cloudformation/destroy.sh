#!/bin/bash
# ============================================================
# 廉価版（CloudFormation 版）削除スクリプト
# ============================================================
# deploy.sh で作ったスタック gon-hp-lite-cfn「だけ」を削除します。
#   1. S3 バケットの中身を空にする（中身があると CloudFormation はバケットを消せないため）
#   2. スタックを削除する（バケット・CloudFront・関数など、スタックで作ったものがすべて消える）
# フル版（GonHpStack）や、他の方法で作った廉価版のバケットには影響しません。
#
# 使い方:
#   bash infra/cloudformation/destroy.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[CFN-LITE-DESTROY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

STACK=${LITE_STACK_NAME:-gon-hp-lite-cfn}
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}

command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"
aws sts get-caller-identity >/dev/null 2>&1 || error "AWS認証情報が設定されていません"

if ! aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" >/dev/null 2>&1; then
  warn "${STACK} が見つかりません（リージョン ${REGION}）。既に削除済みの可能性があります。"
  exit 0
fi

BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)

log "削除対象: スタック ${STACK}（リージョン ${REGION}）"
log "          バケット ${BUCKET}（中身ごと）"
read -p "削除しますか？ 公開中のサイトが見られなくなります (y/yes で削除): " confirm
case "$confirm" in
  y|Y|yes|YES) ;;
  *) log "キャンセルしました"; exit 0 ;;
esac

if [ -n "$BUCKET" ] && [ "$BUCKET" != "None" ] && aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  log "バケットの中身を削除中..."
  aws s3 rm "s3://${BUCKET}" --recursive --region "$REGION"
fi

log "スタックを削除中（CloudFront がある場合は 5〜15 分かかります）..."
aws cloudformation delete-stack --stack-name "$STACK" --region "$REGION"
aws cloudformation wait stack-delete-complete --stack-name "$STACK" --region "$REGION" \
  || error "削除に失敗しました。aws cloudformation describe-stack-events --stack-name ${STACK} --region ${REGION} で理由を確認してください"

log "${STACK} を削除しました ✓"
