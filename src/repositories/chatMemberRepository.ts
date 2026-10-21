import { pool } from '@/config/database';
import { ChatMemberModel } from '@/models/chatMemberModel';
import type { MemberRole } from '@/types/chatMemberInterface';
import type { Queryable } from '@/types/databaseInterface';

const { table, columns } = ChatMemberModel;

export const insertMembers = async (
  db: Queryable,
  chatId: string,
  userIds: string[],
  role: MemberRole,
): Promise<void> => {
  await db.query(
    `INSERT INTO ${table} (${columns.chatId}, ${columns.userId}, ${columns.role})
     SELECT $1, UNNEST($2::uuid[]), $3`,
    [chatId, userIds, role],
  );
};

export const isChatMember = async (chatId: string, userId: string): Promise<boolean> => {
  const result = await pool.query(
    `SELECT 1 FROM ${table} WHERE ${columns.chatId} = $1 AND ${columns.userId} = $2`,
    [chatId, userId],
  );
  return result.rowCount === 1;
};
