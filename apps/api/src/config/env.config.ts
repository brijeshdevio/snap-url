import 'dotenv/config';

export const envConfig = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET!,
  APP_URL: process.env.APP_URL!,
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT!,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID!,
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY!,
  APPWRITE_BUCKET_ID: process.env.APPWRITE_BUCKET_ID!,
};
