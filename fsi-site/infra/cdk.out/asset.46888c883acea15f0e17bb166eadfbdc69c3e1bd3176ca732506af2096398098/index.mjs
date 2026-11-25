/**
 * GET /api/board
 * スレッド一覧取得
 *
 * レスポンス: [{ id, title, resCount, createdAt, lastResAt }]
 *
 * DynamoDB テーブル: fsi-board
 * 環境変数: TABLE_NAME = "fsi-board"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-board";

export const handler = async () => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const result = await ddb.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": "BOARD" },
    }));

    const list = (result.Items || []).map((t) => {
      const responses = t.responses || [];
      return {
        id: t.SK,
        title: t.title,
        resCount: responses.length,
        createdAt: t.createdAt,
        lastResAt: responses.length > 0
          ? responses[responses.length - 1].createdAt
          : t.createdAt,
      };
    });

    list.sort((a, b) => new Date(b.lastResAt) - new Date(a.lastResAt));

    return { statusCode: 200, headers, body: JSON.stringify(list) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
