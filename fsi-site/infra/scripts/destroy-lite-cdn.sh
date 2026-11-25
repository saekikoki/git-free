#!/bin/bash
# ============================================================
# 廉価版（CloudFront 版）削除スクリプト
# ============================================================
# deploy-lite-cdn.sh で作った GonHpLiteStack「だけ」を削除します。
#   - CloudFront ディストリビューション・関数
#   - S3 バケット gon-hp-lite-cdn-<アカウントID>（中身ごと）
# フル版（GonHpStack）や S3 版（deploy-lite.sh のバケット）には影響しません。
#
# 使い方:
#   bash infra/scripts/destroy-lite-cdn.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DESTROY-LITE-CDN]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

STACK=GonHpLiteStack

command -v aws >/dev/null 2>&1 || error "AWS CLI がインストールされていません"
aws sts get-caller-identity >/dev/null 2>&1 || error "AWS認証情報が設定されていません"
REGION=${AWS_DEFAULT_REGION:-ap-northeast-3}
export CDK_DEFAULT_REGION="$REGION"

if ! aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" >/dev/null 2>&1; then
  warn "${STACK} が見つかりません。既に削除済みの可能性があります。"
  exit 0
fi

log "削除対象: ${STACK}（リージョン ${REGION}）のみ"
read -p "${STACK} を削除しますか？ CloudFront と S3 の中身が消えます (y/yes で削除): " confirm
case "$confirm" in
  y|Y|yes|YES) ;;
  *) log "キャンセルしました"; exit 0 ;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.."
[ -d node_modules ] || npm install

# allowMissingDist: ビルド結果（dist-lite/）がなくても削除できるようにする
npx cdk destroy "$STACK" -c edition=lite -c allowMissingDist=true --force

log "${STACK} を削除しました ✓（CloudFront の削除完了まで、さらに数分かかることがあります）"
