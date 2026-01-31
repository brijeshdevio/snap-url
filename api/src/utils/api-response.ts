import type { Response } from 'express';

export function apiResponse<D, R>(
  statusCode: number = 200,
  {
    data,
    rest = {},
    message,
    success = true,
  }: {
    data?: D;
    rest?: R | { [key: string]: any };
    message?: string;
    success?: boolean;
  },
) {
  return function (res: Response): Response {
    return res.status(statusCode).json({
      success,
      statusCode,
      data,
      message,
      ...rest,
    });
  };
}
