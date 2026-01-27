import crypto from 'node:crypto';
import argon from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

export async function comparePassword(
  hashedPasswod: string,
  password: string,
): Promise<boolean> {
  return await argon.verify(hashedPasswod, password);
}

export async function generateToken(): Promise<string> {
  return await crypto
    .createHash('sha256')
    .update(Math.random().toString())
    .digest('hex');
}
