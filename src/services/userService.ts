import { findUserById, insertUser } from '@/repositories/userRepository';
import type { User } from '@/types/userInterface';
import { AppError } from '@/utils/appError';

export const createUser = (name: string): Promise<User> => insertUser(name);

export const getUserById = async (userId: string): Promise<User> => {
  const user = await findUserById(userId);
  if (!user) throw AppError.notFound(`User ${userId} not found`);
  return user;
};
