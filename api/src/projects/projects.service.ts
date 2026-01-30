import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateKeyHash } from 'src/utils';
import type { Project } from 'src/generated/prisma/client';
import type {
  CreateProjectDto,
  QueryProjectDto,
  UpdateProjectDto,
} from './dto';

type ProjectsResponse = {
  projects: Omit<Project, 'userId' | 'keyHash'>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateProjectNameUnique(userId: string, name: string) {
    const existingProject = await this.prisma.project.findFirst({
      where: { name, userId },
    });

    if (existingProject) {
      throw new ConflictException(`Project name ${name} already exists.`);
    }
  }

  private async getKeyHash(): Promise<string> {
    const keyHash = generateKeyHash();
    const isUnique = await this.prisma.project.findFirst({
      where: { keyHash },
    });
    if (!isUnique) {
      return keyHash;
    }

    return await this.getKeyHash();
  }

  async createProject(
    userId: string,
    data: CreateProjectDto,
  ): Promise<Omit<Project, 'userId'>> {
    await this.validateProjectNameUnique(userId, data.name);
    const keyHash = await this.getKeyHash();
    const project = await this.prisma.project.create({
      data: {
        ...data,
        keyHash,
        userId,
      },
      omit: { userId: true },
    });
    return project;
  }

  async getProjects(
    userId: string,
    query: QueryProjectDto,
  ): Promise<ProjectsResponse> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.q && { name: { contains: query.q } }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        omit: { userId: true, keyHash: true },
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getProject(
    userId: string,
    projectId: string,
  ): Promise<Omit<Project, 'userId'>> {
    const project = await this.prisma.project.findUnique({
      where: { userId, id: projectId },
      omit: { userId: true },
    });
    if (project) return project;

    throw new NotFoundException(`Project with id ${projectId} not found.`);
  }

  async updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<Omit<Project, 'userId' | 'keyHash'>> {
    if (data.name) await this.validateProjectNameUnique(userId, data.name);

    try {
      return await this.prisma.project.update({
        where: { id: projectId, userId },
        data: { ...data },
        omit: { userId: true, keyHash: true },
      });
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new NotFoundException(`Project with id ${projectId} not found.`);
      }
      throw error;
    }
  }

  async revokeProject(
    userId: string,
    projectId: string,
  ): Promise<Omit<Project, 'userId' | 'keyHash'>> {
    try {
      return await this.prisma.project.update({
        where: { id: projectId, userId, revoked: false },
        data: { revoked: true, revokedAt: new Date(), status: 'revoked' },
        omit: { userId: true, keyHash: true },
      });
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new NotFoundException(`Project with id ${projectId} not found.`);
      }
      throw error;
    }
  }

  async deleteProject(
    userId: string,
    projectId: string,
  ): Promise<Omit<Project, 'userId' | 'keyHash'>> {
    try {
      return await this.prisma.project.delete({
        where: { userId, id: projectId },
        omit: { userId: true, keyHash: true },
      });
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new NotFoundException(`Project with id ${projectId} not found.`);
      }
      throw error;
    }
  }

  async verifyUploadKey(
    keyHash: string,
  ): Promise<{ id: string; userId: string }> {
    const project = await this.prisma.project.findUnique({
      where: {
        keyHash,
        revoked: false,
        status: 'active',
      },
      select: { id: true, userId: true },
    });

    if (project) {
      return project;
    }

    throw new ForbiddenException(`Invalid or expired Upload key.`);
  }
}
