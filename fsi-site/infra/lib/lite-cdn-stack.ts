/**
 * GonHpLiteStack - 廉価版を CloudFront 経由で HTTPS 配信するための CDK スタック
 *
 * deploy-lite.sh（S3 のウェブサイト機能だけ。HTTP のみ）の上位版。
 * サーバー・DB は使わない点は同じで、次が増える。
 *   - HTTPS で配信（http:// で来たら https:// に転送）
 *   - 独自ドメイン（例: www.example.co.jp）を使える
 *   - S3 バケットは非公開のまま（CloudFront だけが読める）。
 *     「ブロックパブリックアクセス」が有効な組織のアカウントでも公開できる
 *   - セキュリティ用のレスポンスヘッダー（HSTS など）を付ける
 *
 * 構成:
 *   - S3 バケット（非公開）  gon-hp-lite-cdn-<アカウントID>
 *   - CloudFront Function   /company → /company/index.html のように、URL をファイル名に直す
 *   - CloudFront            存在しないURLには /404.html を 404 で返す
 *
 * 独自ドメインを使う場合（任意）:
 *   -c domainName=www.example.co.jp -c certificateArn=arn:aws:acm:us-east-1:...
 *   証明書は CloudFront の決まりで「us-east-1（バージニア北部）」の ACM で作る。
 *   DNS には CloudFront のドメイン名（出力の DistributionDomainName）を CNAME で登録する。
 */
import { Stack, StackProps, RemovalPolicy, Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as path from "path";
import * as fs from "fs";

export interface GonHpLiteStackProps extends StackProps {
  /** 独自ドメイン（例: www.example.co.jp）。省略時は CloudFront のドメインのみ */
  domainName?: string;
  /** 独自ドメイン用の ACM 証明書 ARN（us-east-1 で作成したもの） */
  certificateArn?: string;
}

// URL の末尾が「/」や拡張子なしなら index.html を付ける（S3 は自動では付けないため）
const REWRITE_FUNCTION_CODE = `
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  // 末尾が / のURLは、そのフォルダの index.html を返す
  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }
  // 拡張子のないURL（/company）は /company/ に 301 で転送する。
  // 同じページに2つのURLができると、検索エンジンの評価が分散するため
  if (uri.split("/").pop().indexOf(".") === -1) {
    var qs = [];
    for (var key in request.querystring) {
      var v = request.querystring[key];
      if (v.multiValue) {
        v.multiValue.forEach(function (m) { qs.push(key + "=" + m.value); });
      } else {
        qs.push(v.value === "" ? key : key + "=" + v.value);
      }
    }
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: uri + "/" + (qs.length ? "?" + qs.join("&") : "") } },
    };
  }
  return request;
}
`;

export class GonHpLiteStack extends Stack {
  constructor(scope: Construct, id: string, props: GonHpLiteStackProps = {}) {
    super(scope, id, props);

    const distDir = path.join(__dirname, "../../dist-lite");
    const hasDist = fs.existsSync(path.join(distDir, "index.html")) && fs.existsSync(path.join(distDir, "assets"));
    // 削除（destroy-lite-cdn.sh）のときはビルド結果がなくてもよい
    const allowMissingDist = String(this.node.tryGetContext("allowMissingDist")) === "true";
    if (!hasDist && !allowMissingDist) {
      throw new Error("dist-lite/ がありません。先にプロジェクト直下で npm run build:lite を実行してください。");
    }

    // ---- S3（非公開）----
    // 中身はビルドで作り直せるので、スタック削除時にバケットごと消す
    const bucket = new s3.Bucket(this, "GonHpLiteBucket", {
      bucketName: `gon-hp-lite-cdn-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ---- URL → ファイル名の変換 ----
    const rewrite = new cloudfront.Function(this, "GonHpLiteRewrite", {
      functionName: "gon-hp-lite-rewrite",
      comment: "gon-hp lite: /path -> /path/index.html",
      code: cloudfront.FunctionCode.fromInline(REWRITE_FUNCTION_CODE),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    // ---- 独自ドメイン（任意）----
    const useDomain = Boolean(props.domainName && props.certificateArn);
    const certificate = useDomain
      ? acm.Certificate.fromCertificateArn(this, "GonHpLiteCert", props.certificateArn!)
      : undefined;

    // ---- CloudFront ----
    const distribution = new cloudfront.Distribution(this, "GonHpLiteDistribution", {
      comment: "gon-hp lite website",
      defaultRootObject: "index.html",
      domainNames: useDomain ? [props.domainName!] : undefined,
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200, // 日本を含む地域（全世界より安い）
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        compress: true,
        functionAssociations: [
          { function: rewrite, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      // 非公開バケットは「ない」ファイルに 403 を返すので、403 も 404 と同じ扱いにする
      errorResponses: [403, 404].map((status) => ({
        httpStatus: status,
        responseHttpStatus: 404,
        responsePagePath: "/404.html",
        ttl: Duration.minutes(1),
      })),
    });

    // ---- 出力 ----
    const siteUrl = useDomain ? `https://${props.domainName}` : `https://${distribution.distributionDomainName}`;
    new CfnOutput(this, "SiteUrl", { value: siteUrl, description: "廉価版の公開URL" });
    new CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "CloudFront のドメイン名（独自ドメインの CNAME 先）",
    });
    new CfnOutput(this, "DistributionId", { value: distribution.distributionId });
    new CfnOutput(this, "BucketName", { value: bucket.bucketName });

    if (!hasDist) return;

    // ---- アップロード ----
    // JS・CSS（assets/）はファイル名にハッシュが付くので長期キャッシュ
    const assets = new s3deploy.BucketDeployment(this, "GonHpLiteDeployAssets", {
      sources: [s3deploy.Source.asset(path.join(distDir, "assets"))],
      destinationBucket: bucket,
      destinationKeyPrefix: "assets/",
      cacheControl: [s3deploy.CacheControl.fromString("public, max-age=31536000, immutable")],
      memoryLimit: 512,
    });

    // HTML・sitemap.xml・RSS・画像などはキャッシュさせず、更新をすぐ届ける
    const pages = new s3deploy.BucketDeployment(this, "GonHpLiteDeployPages", {
      sources: [s3deploy.Source.asset(distDir, { exclude: ["assets/**"] })],
      destinationBucket: bucket,
      exclude: ["assets/*"], // assets/ は上で管理するので、ここでは消さない
      cacheControl: [s3deploy.CacheControl.fromString("no-cache")],
      distribution,
      distributionPaths: ["/*"],
      memoryLimit: 512,
    });
    // 新しい HTML が参照する JS・CSS が先に揃うよう、assets/ のアップロードを先に行う
    pages.node.addDependency(assets);
  }
}
