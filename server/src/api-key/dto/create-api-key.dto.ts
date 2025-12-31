import { z } from 'zod';

export const CreateApiKeySchema = z
  .object({
    name: z.string().min(3, 'Name is required'),
  })
  .strict();

export type CreateApiKeyDto = z.infer<typeof CreateApiKeySchema>;
