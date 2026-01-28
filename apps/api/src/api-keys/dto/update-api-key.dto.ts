import { z } from 'zod';

export const UpdateApiKeySchema = z
  .object({
    name: z.string().min(3).max(30),
  })
  .strict();

export type UpdateApiKeyDto = z.infer<typeof UpdateApiKeySchema>;
