import z from 'zod';

export const CreateSchema = z
  .object({
    name: z
      .string('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(30, 'Name must be at most 30 characters'),
    description: z
      .string('Description is required')
      .min(3, 'Description must be at least 3 characters')
      .max(300, 'Description must be at most 300 characters')
      .optional(),
    expireAt: z
      .date()
      .min(new Date(), 'Date must be in the future')
      .max(new Date('2100-01-01'), 'Date must be before 2100')
      .optional(),
  })
  .strict();
