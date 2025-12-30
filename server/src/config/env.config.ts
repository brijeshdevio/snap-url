export const envConfig = {
  MONGODB_URL: process.env.MONGODB_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN! as unknown as number,
};
