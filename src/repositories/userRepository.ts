import { pool } from '@/config/database';
import { UserModel } from '@/models/userModel';
import type { User } from '@/types/userInterface';
import { firstRowOrThrow, selectColumns } from '@/utils/sql';

const { table, columns } = UserModel;
const USER_COLUMNS = selectColumns(UserModel);

export const insertUser = async (name: string): Promise<User> => {
  const result = await pool.query<User>(
    `INSERT INTO ${table} (${columns.name}) VALUES ($1) RETURNING ${USER_COLUMNS}`,
    [name],
  );
  return firstRowOrThrow(result);
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT ${USER_COLUMNS} FROM ${table} WHERE ${columns.id} = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};
