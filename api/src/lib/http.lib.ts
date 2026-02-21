import type { CookieOptions, Response } from 'express';
import { envConfig } from '../config';

const isProd = envConfig.NODE_ENV === 'production';

export function setCookie(
  key: string,
  token: string,
  res: Response,
  options?: CookieOptions,
): void {
  res.cookie(key, token, {
    httpOnly: isProd,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
    ...options,
  });
}

export function clearCookie(key: string, res: Response): void {
  res.clearCookie(key);
}

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
  return {
    success,
    statusCode,
    data,
    message,
    ...rest,
  };
}
