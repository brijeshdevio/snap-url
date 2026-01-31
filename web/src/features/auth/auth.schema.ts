import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name is required")
      .max(30, "Name must be at most 30 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
  })
  .strict();

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
  })
  .strict();

export type LoginDto = z.infer<typeof LoginSchema>;
