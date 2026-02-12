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
};

// =============== AUTH DTOs ===============

export type FindOrCreateUserDto = {
  email?: string;
  name?: string;
  authProvider: AuthProvider;
  authId: string;
};
