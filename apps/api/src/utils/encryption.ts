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

export function generateToken(): string {
  return crypto
    .createHash('sha256')
    .update(Math.random().toString())
    .digest('hex');
}

export function generateApiKey(): string {
  const token = crypto.randomBytes(64).toString('hex');
  const secretHash =
    'ssk_' + crypto.createHash('sha256').update(token).digest('hex');
  return secretHash;
}
