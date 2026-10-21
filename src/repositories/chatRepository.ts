import { pool } from '@/config/database';
import { ChatMemberModel } from '@/models/chatMemberModel';
import { ChatModel } from '@/models/chatModel';
import type { Chat, ChatWithMembers } from '@/types/chatInterface';
import type { Queryable } from '@/types/databaseInterface';
import { selectColumns } from '@/utils/sql';

const { table, columns } = ChatModel;
const CHAT_COLUMNS = selectColumns(ChatModel);

export const findChatById = async (chatId: string): Promise<Chat | null> => {
  const result = await pool.query<Chat>(
    `SELECT ${CHAT_COLUMNS} FROM ${table} WHERE ${columns.id} = $1`,
    [chatId],
  );
  return result.rows[0] ?? null;
};

export const touchChat = async (chatId: string): Promise<void> => {
  await pool.query(`UPDATE ${table} SET ${columns.updatedAt} = NOW() WHERE ${columns.id} = $1`, [
    chatId,
  ]);
};

export const findChatByDirectKey = async (
  directKey: string,
  db: Queryable = pool,
): Promise<Chat | null> => {
  const result = await db.query<Chat>(
    `SELECT ${CHAT_COLUMNS} FROM ${table} WHERE ${columns.directKey} = $1`,
    [directKey],
  );
  return result.rows[0] ?? null;
};

// null if a parallel request created it first
export const insertDirectChat = async (
  db: Queryable,
  directKey: string,
  createdBy: string,
): Promise<Chat | null> => {
  const result = await db.query<Chat>(
    `INSERT INTO ${table} (${columns.type}, ${columns.directKey}, ${columns.createdBy})
     VALUES ('direct', $1, $2)
     ON CONFLICT (${columns.directKey}) DO NOTHING
     RETURNING ${CHAT_COLUMNS}`,
    [directKey, createdBy],
  );
  return result.rows[0] ?? null;
};

const members = ChatMemberModel.columns;

// me = the user's rows, cm = all members of those chats
export const findChatsByUserId = async (userId: string): Promise<ChatWithMembers[]> => {
  const result = await pool.query<ChatWithMembers>(
    `SELECT ${selectColumns(ChatModel, 'c')},
            array_agg(cm.${members.userId} ORDER BY cm.${members.joinedAt}) AS "memberIds"
     FROM ${ChatMemberModel.table} me
     JOIN ${table} c ON c.${columns.id} = me.${members.chatId}
     JOIN ${ChatMemberModel.table} cm ON cm.${members.chatId} = c.${columns.id}
     WHERE me.${members.userId} = $1
     GROUP BY c.${columns.id}
     ORDER BY c.${columns.updatedAt} DESC`,
    [userId],
  );
  return result.rows;
};
