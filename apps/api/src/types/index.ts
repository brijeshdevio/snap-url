import type { ApiKey, User } from 'src/generated/prisma/client';

export type Login = {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
};

export type CurrentUser = {
  user: { id: string };
  auth: {
    refreshToken: string;
  };
};

export type ApiKeys = {
  apiKeys: Omit<ApiKey, 'userId'>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
