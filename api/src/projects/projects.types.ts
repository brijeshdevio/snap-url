import z from 'zod';
import { CreateSchema, UpdateSchema } from './schema';
import { ProjectStatus } from '../generated/prisma/enums';
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

export type UpdateResponse = {
  id: string;
  name: string;
};

export type FindOneResponse = {
  name: string;
  id: string;
  revoked: boolean;
  expiredAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: ProjectStatus;
  usedCount: number;
};
