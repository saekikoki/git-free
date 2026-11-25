/**
 * POST /api/contact
 * お問い合わせ送信
 *
 * リクエストBody: { name, company, email, phone, category, message }
 * 必須: name, email, message
 *
 * DynamoDB テーブル: fsi-contact
 * 環境変数: TABLE_NAME = "fsi-contact"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-contact";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, company, email, phone, category, message } = body;

    if (!name || !email || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "お名前、メールアドレス、お問い合わせ内容は必須です" }) };
    }

    const item = {
      PK: "CONTACT",
      SK: `contact-${Date.now()}`,
      name,
      company: company || "",
      email,
      phone: phone || "",
      category: category || "",
      message,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    return { statusCode: 200, headers, body: JSON.stringify({ message: "お問い合わせを受け付けました" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
