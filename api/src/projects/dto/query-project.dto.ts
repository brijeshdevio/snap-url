import { z } from 'zod';

export const QueryProjectSchema = z
  .object({
    q: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  })
  .strict();

export type QueryProjectDto = z.infer<typeof QueryProjectSchema>;
