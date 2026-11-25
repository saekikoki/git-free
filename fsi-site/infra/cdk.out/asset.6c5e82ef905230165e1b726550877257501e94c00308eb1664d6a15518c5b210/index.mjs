/**
 * POST /api/board
 * 新規スレッド作成
 *
 * リクエストBody: { title, name, message }
 *
 * DynamoDB テーブル: fsi-board
 * 環境変数: TABLE_NAME = "fsi-board"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-board";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { title, name, message } = body;

    if (!title || !title.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "スレッドタイトルを入力してください" }) };
    }
    if (!message || !message.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "本文を入力してください" }) };
    }

    const now = new Date().toISOString();
    const threadId = `thread-${Date.now()}`;

    const item = {
      PK: "BOARD",
      SK: threadId,
      title: title.trim(),
      createdAt: now,
      responses: [
        { num: 1, name: (name && name.trim()) || "匿名", message: message.trim(), createdAt: now },
      ],
    };

    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: threadId, title: item.title, createdAt: now, responses: item.responses }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
