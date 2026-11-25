/**
 * POST /api/board/{id}/res
 * レス書き込み
 *
 * リクエストBody: { name, message }
 *
 * DynamoDB テーブル: fsi-board
 * 環境変数: TABLE_NAME = "fsi-board"
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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

    const body = JSON.parse(event.body || "{}");
    const { name, message } = body;

    if (!message || !message.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: "本文を入力してください" }) };
    }

    // 現在のスレッドを取得
    const getResult = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: "BOARD", SK: id },
    }));

    if (!getResult.Item) {
      return { statusCode: 404, headers, body: JSON.stringify({ message: "スレッドが見つかりません" }) };
    }

    const responses = getResult.Item.responses || [];
    const newRes = {
      num: responses.length + 1,
      name: (name && name.trim()) || "匿名",
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // responsesリストに追加
    await ddb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: "BOARD", SK: id },
      UpdateExpression: "SET responses = list_append(responses, :newRes)",
      ExpressionAttributeValues: { ":newRes": [newRes] },
    }));

    return { statusCode: 201, headers, body: JSON.stringify(newRes) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ message: "Internal Server Error" }) };
  }
};
