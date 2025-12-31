import { z } from 'zod';

export const CreateTokenSchema = z
  .object({
    purpose: z
      .string()
      .refine(
        (v) => ['avatar', 'cover', 'post', 'thumbnail', 'other'].includes(v),
        { message: 'Invalid purpose' },
      )
      .default('avatar'),
    idempotencyKey: z.string().optional(),
  })
  .strict();

export type CreateTokenDto = z.infer<typeof CreateTokenSchema>;
