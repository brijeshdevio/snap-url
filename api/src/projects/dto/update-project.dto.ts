import { z } from 'zod';

export const UpdateProjectSchema = z
  .object({
    name: z
      .string('Project name is required')
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name must be at most 30 characters long')
      .optional(),
    expiredAt: z
      .date()
      .min(new Date(), 'Expired date must be in the future')
      .optional(),
  })
  .strict();

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
