import type { Response } from 'express';

export const ApiResponse =
  <D, R>(
    status: number = 200,
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
  ) =>
  (res: Response): Response => {
    return res.status(status).json({
      success,
      status,
      data,
      message,
      ...rest,
    });
  };
