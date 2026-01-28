import { z } from 'zod';

export const QueryApiKeySchema = z
  .object({
    q: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  })
  .strict();

export type QueryApiKeyDto = z.infer<typeof QueryApiKeySchema>;
