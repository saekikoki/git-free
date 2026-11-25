/**
 * GET /api/board/{id}
 * スレッド詳細取得
 *
 * DynamoDB テーブル: fsi-board
 * 環境変数: TABLE_NAME = "fsi-board"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-board";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "id パラメータが必要です" }) };
    }

    const result = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: "BOARD", SK: id },
    }));

    if (!result.Item) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: "スレッドが見つかりません" }) };
    }

    const thread = result.Item;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: thread.SK,
        title: thread.title,
        createdAt: thread.createdAt,
        responses: thread.responses || [],
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
