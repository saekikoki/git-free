/**
 * DELETE /api/board/{id}/res/{num}
 * レス削除（管理者のみ）— レスの内容を「削除済み」に置換
 *
 * DynamoDB テーブル: fsi-board
 * 環境変数: TABLE_NAME = "fsi-board"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "fsi-board";

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
    const id = event.pathParameters?.id;
    const num = parseInt(event.pathParameters?.num, 10);

    if (!id || isNaN(num)) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "パラメータが不正です" }) };
    }

    // スレッドを取得
    const getResult = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: "BOARD", SK: id },
    }));

    if (!getResult.Item) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: "スレッドが見つかりません" }) };
    }

    const thread = getResult.Item;
    const responses = thread.responses || [];
    const index = responses.findIndex((r) => r.num === num);

    if (index === -1) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: "レスが見つかりません" }) };
    }

    // レスを「削除済み」に置換
    responses[index] = {
      ...responses[index],
      name: "削除済み",
      message: "このレスは管理者により削除されました。",
    };

    // スレッド全体を上書き保存
    await ddb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: { ...thread, responses },
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ message: "削除しました" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
