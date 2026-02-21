import z from 'zod';
import { AuthProvider } from '../generated/prisma/enums';
import { LoginSchema, RegisterSchema } from './schema';

// ================ DTOs =================

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;

export type FindOrCreateUserDto = {
  email?: string;
  name?: string;
  authProvider: AuthProvider;
  authId: string;
};

// ================ Types =================

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
