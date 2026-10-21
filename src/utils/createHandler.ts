import type { Request, RequestHandler, Response } from 'express';
import type { z } from 'zod';
import { AppError } from '@/utils/appError';

const parseRequest = <S extends z.ZodType>(schema: S, req: Request): z.infer<S> => {
  // Express types the body as `any`; treat it as unknown until zod checks it
  const body: unknown = req.body;
  const result = schema.safeParse({ body, params: req.params, query: req.query });

  if (!result.success) {
    throw AppError.validation(
      result.error.issues.map((issue) => ({
        field: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    );
  }
  return result.data;
};

// Validates body, params and query with one zod schema, then passes typed input to the handler
export const createHandler =
  <S extends z.ZodType>(
    schema: S,
    handle: (input: z.infer<S>, res: Response) => Promise<void> | void,
  ): RequestHandler =>
  async (req, res) => {
    await handle(parseRequest(schema, req), res);
  };
