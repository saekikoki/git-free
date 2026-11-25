/**
 * GET /api/news/{sk}
 * ニュース詳細取得
 *
 * DynamoDB テーブル: fsi-news
 * 環境変数: TABLE_NAME = "fsi-news"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-news";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const sk = event.pathParameters?.sk;
    if (!sk) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "sk パラメータが必要です" }) };
    }

    const result = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: "NEWS", SK: sk },
    }));

    if (!result.Item) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: "ニュースが見つかりません" }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(result.Item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
