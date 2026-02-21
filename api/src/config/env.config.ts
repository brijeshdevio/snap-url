import 'dotenv/config';

export const envConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET!,
  APP_URL: process.env.APP_URL!,
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT!,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID!,
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY!,
  APPWRITE_BUCKET_ID: process.env.APPWRITE_BUCKET_ID!,
  APPWRITE_NOT_FOUND: process.env.APPWRITE_NOT_FOUND!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
  GITHUB_CALLBACK: process.env.GITHUB_CALLBACK!,
};
