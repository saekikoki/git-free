/**
 * DELETE /api/news/{sk}
 * ニュース削除（管理者のみ）
 *
 * DynamoDB テーブル: fsi-news
 * 環境変数: TABLE_NAME = "fsi-news"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-news";

function verifyAdmin(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader) return false;
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [, role] = decoded.split(":");
    return role === "admin";
  } catch {
    return false;
  }
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (!verifyAdmin(event)) {
    return { statusCode: 403, headers, body: JSON.stringify({ message: "管理者権限が必要です" }) };
  }

  try {
    const sk = event.pathParameters?.sk;
    if (!sk) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "sk パラメータが必要です" }) };
    }

    await ddb.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: "NEWS", SK: sk },
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ message: "削除しました" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
