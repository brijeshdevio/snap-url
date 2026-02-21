import { z } from 'zod';

export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(30, 'Password must be at most 30 characters'),
  })
  .strict();
