export const PRISMA_ERROR_CODES = {
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};

export const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$/y1jJS2H1+mZ1Sg77uvgAg$AYsdfipeVFRQxT2zXSCaw6581/ZdUV1I1MOjlng0fCM';

export const COOKIE_NAME = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

export const EXPIRED_REFRESH_TOKEN = 7 * 24 * 60 * 60 * 1000;

export const MESSAGES = {
  USER_CREATION_SUCCESS: 'User created successfully.',
  USER_LOGIN_SUCCESS: 'User logged in successfully.',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully.',
  USER_LOGOUT_SUCCESS: 'User logged out successfully.',
  UNAUTHORIZED: 'You are not logged in. Please login to continue.',
  PROJECT_CREATION_SUCCESS: 'Project created successfully.',
  PROJECT_UPDATE_SUCCESS: 'Project updated successfully.',
  PROJECT_DELETE_SUCCESS: 'Project deleted successfully.',
  IMAGE_UPLOAD_SUCCESS: 'Image uploaded successfully.',
  IMAGE_DELETE_SUCCESS: 'Image deleted successfully.',
};

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
