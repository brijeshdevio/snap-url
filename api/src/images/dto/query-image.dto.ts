import { z } from 'zod';

export const QueryImageSchema = z
  .object({
    q: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  })
  .strict();

export type QueryImageDto = z.infer<typeof QueryImageSchema>;
