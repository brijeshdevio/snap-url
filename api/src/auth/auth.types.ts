import { AuthProvider } from '../generated/prisma/enums';

// =============== AUTH RESPONSES ===============

export type BaseUserResponse = {
  id: string;
  email: string | null;
  name: string | null;
  createdAt: Date;
};

export type RegisterResponse = BaseUserResponse;

export type LoginResponse = {
  user: BaseUserResponse;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

// =============== AUTH DTOs ===============

export type FindOrCreateUserDto = {
  email?: string;
  name?: string;
  authProvider: AuthProvider;
  authId: string;
};
