import type { Response } from 'express';
import type { ErrorResponse, SuccessResponse } from '@/types/responseInterface';
import type { AppError } from '@/utils/appError';

export const sendSuccess = (res: Response, data: unknown, statusCode = 200): void => {
  const body: SuccessResponse<unknown> = { success: true, data };
  res.status(statusCode).json(body);
};

export const sendError = (res: Response, error: AppError): void => {
  const body: ErrorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  };
  res.status(error.statusCode).json(body);
};
