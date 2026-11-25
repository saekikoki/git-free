/**
 * POST /api/login
 * ログイン認証
 *
 * リクエストBody: { email, password }
 * レスポンス: { email, role, token }
 *
 * DynamoDB テーブル: fsi-users
 * 環境変数: TABLE_NAME = "fsi-users"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { createHash, randomBytes } from "crypto";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-users";

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(email, role) {
  const payload = `${email}:${role}:${Date.now()}:${randomBytes(16).toString("hex")}`;
  return Buffer.from(payload).toString("base64");
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    if (!email || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "メールアドレスとパスワードを入力してください" }) };
    }

    const result = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { email },
    }));

    const user = result.Item;
    if (!user || user.password !== hashPassword(password)) {
      return { statusCode: 401, headers, body: JSON.stringify({ message: "メールアドレスまたはパスワードが正しくありません" }) };
    }

    const token = generateToken(user.email, user.role);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ email: user.email, role: user.role, token }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
