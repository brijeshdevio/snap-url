import z from 'zod';

export const UpdateSchema = z
  .object({
    name: z
      .string('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name must be at most 30 characters')
      .optional(),
    description: z
      .string('Description is required')
      .min(3, 'Description must be at least 3 characters')
      .max(300, 'Description must be at most 300 characters')
      .optional(),
  })
  .refine((data) => {
    if (!data.name && !data.description) {
      return {
        message: 'At least one field must be provided',
        path: ['name', 'description'],
      };
    }
  })
  .strict();
