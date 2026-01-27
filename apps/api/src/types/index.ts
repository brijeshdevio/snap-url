import type { User } from 'src/generated/prisma/client';

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
