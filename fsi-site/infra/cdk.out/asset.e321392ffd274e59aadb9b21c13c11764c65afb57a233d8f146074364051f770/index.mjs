/**
 * POST /api/news
 * ニュース投稿（管理者のみ）
 *
 * リクエストBody: { title, category, content }
 * Authorization: Bearer {token}
 *
 * DynamoDB テーブル: fsi-news
 * 環境変数: TABLE_NAME = "fsi-news"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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
    const body = JSON.parse(event.body || "{}");
    const { title, category, content } = body;

    if (!title) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "タイトルは必須です" }) };
    }

    const item = {
      PK: "NEWS",
      SK: `news-${Date.now()}`,
      title,
      category: category || "",
      content: content || "",
      publishedAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    return { statusCode: 201, headers, body: JSON.stringify(item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
