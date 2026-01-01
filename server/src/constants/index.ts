import { envConfig } from '@/config/env.config';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const DEFAULT_STORAGE_QUOTA = 100 * 100 * 100 * 5; // 500MB

export const getURL = (displayName: string) => {
  const urlSuffix = envConfig.API_URL ?? 'http://localhost:4000';
  return `${urlSuffix}/images/${displayName}`;
};
