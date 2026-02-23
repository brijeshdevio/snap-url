import { z } from "zod";

export const CreateProjectSchema = z
  .object({
    name: z
      .string("Project name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must be at most 30 characters long"),
    expireAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }) // Check if the date is valid
      .transform((val) => new Date(val)) // Convert to Date object
      .refine((date) => date >= new Date(), {
        message: "Date must be after today",
      })
      .refine((date) => date <= new Date(2050, 0, 1), {
        message: "Date must be before 2050",
      }),
  })
  .strict();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
