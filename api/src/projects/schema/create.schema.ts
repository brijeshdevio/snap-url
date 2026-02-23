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
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }) // Check if the date is valid
      .transform((val) => new Date(val)) // Convert to Date object
      .refine((date) => date >= new Date(), {
        message: 'Date must be after today',
      })
      .refine((date) => date <= new Date(2050, 0, 1), {
        message: 'Date must be before 2050',
      }),
  })
  .strict();
