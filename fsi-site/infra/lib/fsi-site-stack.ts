/**
 * GonHpStack - gon-hp サイトの全AWSリソースを定義するCDKスタック
 *
 * 構成:
 *   - DynamoDB テーブル x4 (users, news, board, contact)
 *   - Lambda 関数 x12 (各APIエンドポイント)
 *   - API Gateway REST API (全12エンドポイント + CORS)
 *   - S3 バケット (フロントエンド静的ファイル)
 *   - CloudFront ディストリビューション (CDN + HTTPS)
 */
import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";

export class GonHpStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ============================================================
    // DynamoDB テーブル
    // ============================================================

    const usersTable = new dynamodb.Table(this, "GonHpUsersTable", {
      tableName: "gon-hp-users",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const newsTable = new dynamodb.Table(this, "GonHpNewsTable", {
      tableName: "gon-hp-news",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const boardTable = new dynamodb.Table(this, "GonHpBoardTable", {
      tableName: "gon-hp-board",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const contactTable = new dynamodb.Table(this, "GonHpContactTable", {
      tableName: "gon-hp-contact",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // ============================================================
    // Lambda 関数
    // ============================================================

    const lambdaDir = path.join(__dirname, "../../backend/lambdas");

    const createLambda = (
      id: string,
      fileName: string,
      functionName: string,
      table: dynamodb.Table,
      tableName: string
    ): lambda.Function => {
      const fn = new lambda.Function(this, id, {
        functionName,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(lambdaDir, {
          bundling: {
            image: lambda.Runtime.NODEJS_20_X.bundlingImage,
            command: [
              "bash", "-c",
              `cp ${fileName} /asset-output/index.mjs`,
            ],
          },
        }),
        environment: { TABLE_NAME: tableName },
        timeout: Duration.seconds(10),
        memorySize: 128,
      });
      table.grantReadWriteData(fn);
      return fn;
    };

    // --- 認証 ---
    const loginFn = createLambda("GonHpLogin", "fsi-login.mjs", "gon-hp-login", usersTable, "gon-hp-users");

    // --- ニュース ---
    const newsListFn = createLambda("GonHpNewsList", "fsi-news-list.mjs", "gon-hp-news-list", newsTable, "gon-hp-news");
    const newsGetFn = createLambda("GonHpNewsGet", "fsi-news-get.mjs", "gon-hp-news-get", newsTable, "gon-hp-news");
    const newsCreateFn = createLambda("GonHpNewsCreate", "fsi-news-create.mjs", "gon-hp-news-create", newsTable, "gon-hp-news");
    const newsDeleteFn = createLambda("GonHpNewsDelete", "fsi-news-delete.mjs", "gon-hp-news-delete", newsTable, "gon-hp-news");

    // --- お問い合わせ ---
    const contactFn = createLambda("GonHpContact", "fsi-contact.mjs", "gon-hp-contact", contactTable, "gon-hp-contact");

    // --- 掲示板 ---
    const boardListFn = createLambda("GonHpBoardList", "fsi-board-list.mjs", "gon-hp-board-list", boardTable, "gon-hp-board");
    const boardGetFn = createLambda("GonHpBoardGet", "fsi-board-get.mjs", "gon-hp-board-get", boardTable, "gon-hp-board");
    const boardCreateFn = createLambda("GonHpBoardCreate", "fsi-board-create.mjs", "gon-hp-board-create", boardTable, "gon-hp-board");
    const boardResFn = createLambda("GonHpBoardRes", "fsi-board-res.mjs", "gon-hp-board-res", boardTable, "gon-hp-board");
    const boardDeleteFn = createLambda("GonHpBoardDelete", "fsi-board-delete.mjs", "gon-hp-board-delete", boardTable, "gon-hp-board");
    const boardResDeleteFn = createLambda("GonHpBoardResDelete", "fsi-board-res-delete.mjs", "gon-hp-board-res-delete", boardTable, "gon-hp-board");

    // ============================================================
    // API Gateway
    // ============================================================

    const api = new apigateway.RestApi(this, "GonHpApi", {
      restApiName: "gon-hp-api",
      description: "gon-hp Backend API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
      deployOptions: { stageName: "prod" },
    });

    // /api リソース
    const apiResource = api.root.addResource("api");

    // --- /api/login ---
    const loginResource = apiResource.addResource("login");
    loginResource.addMethod("POST", new apigateway.LambdaIntegration(loginFn));

    // --- /api/news ---
    const newsResource = apiResource.addResource("news");
    newsResource.addMethod("GET", new apigateway.LambdaIntegration(newsListFn));
    newsResource.addMethod("POST", new apigateway.LambdaIntegration(newsCreateFn));

    // --- /api/news/{sk} ---
    const newsItemResource = newsResource.addResource("{sk}");
    newsItemResource.addMethod("GET", new apigateway.LambdaIntegration(newsGetFn));
    newsItemResource.addMethod("DELETE", new apigateway.LambdaIntegration(newsDeleteFn));

    // --- /api/contact ---
    const contactResource = apiResource.addResource("contact");
    contactResource.addMethod("POST", new apigateway.LambdaIntegration(contactFn));

    // --- /api/board ---
    const boardResource = apiResource.addResource("board");
    boardResource.addMethod("GET", new apigateway.LambdaIntegration(boardListFn));
    boardResource.addMethod("POST", new apigateway.LambdaIntegration(boardCreateFn));

    // --- /api/board/{id} ---
    const boardItemResource = boardResource.addResource("{id}");
    boardItemResource.addMethod("GET", new apigateway.LambdaIntegration(boardGetFn));
    boardItemResource.addMethod("DELETE", new apigateway.LambdaIntegration(boardDeleteFn));

    // --- /api/board/{id}/res ---
    const boardResResource = boardItemResource.addResource("res");
    boardResResource.addMethod("POST", new apigateway.LambdaIntegration(boardResFn));

    // --- /api/board/{id}/res/{num} ---
    const boardResItemResource = boardResResource.addResource("{num}");
    boardResItemResource.addMethod("DELETE", new apigateway.LambdaIntegration(boardResDeleteFn));

    // ============================================================
    // S3 バケット
    // ============================================================

    const siteBucket = new s3.Bucket(this, "GonHpBucket", {
      bucketName: `gon-hp-frontend-${this.account}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // ============================================================
    // CloudFront
    // ============================================================

    const distribution = new cloudfront.Distribution(this, "GonHpDistribution", {
      comment: "gon-hp Website",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: new origins.RestApiOrigin(api),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.minutes(0),
        },
      ],
    });

    // ============================================================
    // フロントエンドデプロイ
    // ============================================================

    new s3deploy.BucketDeployment(this, "GonHpDeploy", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "../../dist"))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // ============================================================
    // 出力
    // ============================================================

    new CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway URL",
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "CloudFront Distribution URL (Website)",
    });

    new CfnOutput(this, "S3BucketName", {
      value: siteBucket.bucketName,
      description: "S3 Bucket for frontend files",
    });
  }
}
