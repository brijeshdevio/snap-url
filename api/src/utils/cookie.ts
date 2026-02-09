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
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    ...options,
  });
}

export function clearCookie(key: string, res: Response): void {
  res.clearCookie(key);
}
