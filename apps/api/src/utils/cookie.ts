import type { CookieOptions, Response } from 'express';
import { DAY } from 'src/constants';

export function setCookie(
  key: string,
  token: string,
  res: Response,
  options?: CookieOptions,
): void {
  res.cookie(key, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: DAY,
    ...options,
  });
}

export function clearCookie(key: string, res: Response): void {
  res.clearCookie(key);
}
