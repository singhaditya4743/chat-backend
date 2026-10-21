import type { ErrorCode, ErrorDetail } from '@/types/errorInterface';

// Expected errors with an HTTP status; anything else becomes a 500
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: ErrorDetail[],
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string): AppError {
    return new AppError(400, 'BAD_REQUEST', message);
  }

  static validation(details: ErrorDetail[]): AppError {
    return new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', details);
  }

  static forbidden(message: string): AppError {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(message: string): AppError {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, 'CONFLICT', message);
  }

  static internal(): AppError {
    return new AppError(500, 'INTERNAL_ERROR', 'Something went wrong');
  }
}
