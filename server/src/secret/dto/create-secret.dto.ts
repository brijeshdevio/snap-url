import { z } from 'zod';

export const CreateSecretSchema = z
  .object({
    name: z.string().min(3, 'Name is required'),
  })
  .strict();

export type CreateSecretDto = z.infer<typeof CreateSecretSchema>;
