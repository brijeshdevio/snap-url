import { z } from 'zod';

export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict();

export type LoginDto = z.infer<typeof LoginSchema>;
