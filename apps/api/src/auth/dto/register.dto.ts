import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict();

export type RegisterDto = z.infer<typeof RegisterSchema>;
