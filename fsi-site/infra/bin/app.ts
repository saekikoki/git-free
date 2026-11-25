#!/usr/bin/env node
/**
 * CDKアプリケーションのエントリポイント
 *
 * どちらのスタックを扱うかは -c edition=... で切り替える。
 *   （指定なし）     → GonHpStack      フル版（DB・API・CloudFront）  … deploy.sh
 *   -c edition=lite  → GonHpLiteStack  廉価版の CloudFront 配信       … deploy-lite-cdn.sh
 *
 * それぞれ dist/ と dist-lite/ のビルド結果を使うので、
 * 使わない方のビルドがなくてもエラーにならないよう、片方だけを作る。
 */
import { App } from "aws-cdk-lib";
import { GonHpStack } from "../lib/fsi-site-stack";
import { GonHpLiteStack } from "../lib/lite-cdn-stack";

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || "ap-northeast-3",
};

if (app.node.tryGetContext("edition") === "lite") {
  new GonHpLiteStack(app, "GonHpLiteStack", {
    env,
    description: "gon-hp lite website (S3 + CloudFront, no server)",
    domainName: app.node.tryGetContext("domainName") || undefined,
    certificateArn: app.node.tryGetContext("certificateArn") || undefined,
  });
} else {
  new GonHpStack(app, "GonHpStack", {
    env,
    description: "gon-hp Website Infrastructure",
  });
}
