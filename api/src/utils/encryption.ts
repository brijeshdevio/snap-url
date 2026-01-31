import crypto from 'node:crypto';
import argon from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

export async function comparePassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return await argon.verify(hashedPassword, password);
}

export function generateKeyHash(): string {
  const token = crypto.randomBytes(64).toString('hex');
  const secretHash =
    'sk_' + crypto.createHash('sha256').update(token).digest('hex');
  return secretHash;
}

export function generateSignKey(): string {
  return crypto
    .createHash('sha256')
    .update(Math.random().toString())
    .digest('hex');
}
