import z from 'zod';
import { CreateSchema, UpdateSchema } from './schema';
// ================ DTOs =================

export type CreateDto = z.infer<typeof CreateSchema>;
export type UpdateDto = z.infer<typeof UpdateSchema>;

// ================ Types ==============

export type CreateResponse = {
  name: string;
  key: string;
};

export type FindAllResponse = {
  projects: {
    id: string;
    name: string;
    createdAt: Date | null;
    expiredAt: Date | null;
  }[];
};
