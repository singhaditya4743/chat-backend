import { pool } from '@/config/database';
import { ChatMemberModel } from '@/models/chatMemberModel';
import type { ChatMember, MemberRole } from '@/types/chatMemberInterface';
import type { Queryable } from '@/types/databaseInterface';
import { selectColumns } from '@/utils/sql';

const { table, columns } = ChatMemberModel;
const ADMIN: MemberRole = 'admin';

export const insertMembers = async (
  db: Queryable,
  chatId: string,
  userIds: string[],
  role: MemberRole,
): Promise<void> => {
  await db.query(
    `INSERT INTO ${table} (${columns.chatId}, ${columns.userId}, ${columns.role})
     SELECT $1, UNNEST($2::uuid[]), $3
     ON CONFLICT DO NOTHING`,
    [chatId, userIds, role],
  );
};

export const findMemberRole = async (chatId: string, userId: string): Promise<MemberRole | null> => {
  const result = await pool.query<{ role: MemberRole }>(
    `SELECT ${columns.role} AS "role" FROM ${table}
     WHERE ${columns.chatId} = $1 AND ${columns.userId} = $2`,
    [chatId, userId],
  );
  return result.rows[0]?.role ?? null;
};

export const findMembers = async (chatId: string): Promise<ChatMember[]> => {
  const result = await pool.query<ChatMember>(
    `SELECT ${selectColumns(ChatMemberModel)} FROM ${table}
     WHERE ${columns.chatId} = $1 ORDER BY ${columns.joinedAt}, ${columns.userId}`,
    [chatId],
  );
  return result.rows;
};

export const deleteMember = async (db: Queryable, chatId: string, userId: string): Promise<void> => {
  await db.query(`DELETE FROM ${table} WHERE ${columns.chatId} = $1 AND ${columns.userId} = $2`, [
    chatId,
    userId,
  ]);
};

// no admin left -> oldest member becomes admin
export const ensureGroupHasAdmin = async (db: Queryable, chatId: string): Promise<void> => {
  await db.query(
    `UPDATE ${table} SET ${columns.role} = $2
     WHERE ${columns.chatId} = $1
       AND ${columns.userId} = (
         SELECT ${columns.userId} FROM ${table}
         WHERE ${columns.chatId} = $1 ORDER BY ${columns.joinedAt}, ${columns.userId} LIMIT 1
       )
       AND NOT EXISTS (
         SELECT 1 FROM ${table} WHERE ${columns.chatId} = $1 AND ${columns.role} = $2
       )`,
    [chatId, ADMIN],
  );
};
