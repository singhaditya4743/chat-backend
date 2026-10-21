import { pool } from '@/config/database';
import { ChatModel } from '@/models/chatModel';
import type { Chat } from '@/types/chatInterface';
import type { Queryable } from '@/types/databaseInterface';
import { firstRowOrThrow, selectColumns } from '@/utils/sql';

const { table, columns } = ChatModel;

export const insertGroupChat = async (
  db: Queryable,
  name: string,
  createdBy: string,
): Promise<Chat> => {
  const result = await db.query<Chat>(
    `INSERT INTO ${table} (${columns.type}, ${columns.name}, ${columns.createdBy})
     VALUES ('group', $1, $2)
     RETURNING ${selectColumns(ChatModel)}`,
    [name, createdBy],
  );
  return firstRowOrThrow(result);
};

export const updateGroupName = async (chatId: string, name: string): Promise<void> => {
  await pool.query(
    `UPDATE ${table} SET ${columns.name} = $2, ${columns.updatedAt} = NOW()
     WHERE ${columns.id} = $1`,
    [chatId, name],
  );
};
