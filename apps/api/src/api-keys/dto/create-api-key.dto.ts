import { z } from 'zod';

export const CreateApiKeySchema = z
  .object({
    name: z.string().min(3).max(30),
  })
  .strict();

export type CreateApiKeyDto = z.infer<typeof CreateApiKeySchema>;
