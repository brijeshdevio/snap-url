export const ALLOWED_MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg',
  'image/avif',
];
export const MAX_FILE_SIZE = 3 * 1024 * 1024;
export const COOKIE_NAME = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};
export const EXPIRED_REFRESH_TOKEN = 7 * 24 * 60 * 60 * 1000;
export const PRISMA_ERROR_CODES = {
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};
