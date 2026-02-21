import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { PRISMA_ERROR_CODES } from '../constants';
import { randomString, stringHash } from '../lib';
import { CreateDto, CreateResponse, FindAllResponse } from './projects.types';

@Injectable()
export class ProjectsService {
  private prefix = 'sk_live_';
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, data: CreateDto): Promise<CreateResponse> {
    try {
      const key = this.prefix + randomString(12);
      const keyHash = stringHash(key);
      await this.prismaService.project.create({
        data: {
          name: data.name,
          userId,
          keyHash,
          expiredAt: data.expireAt,
        },
      });
      return { key, name: data.name };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.CONFLICT) {
          throw new ConflictException(
            `Project with name ${data.name} already exists. Please try a different name.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string): Promise<FindAllResponse> {
    const projects = await this.prismaService.project.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiredAt: true,
      },
    });
    return { projects };
  }

  async delete(userId: string, id: string): Promise<void> {
    try {
      await this.prismaService.project.update({
        where: { userId, id },
        data: {
          expiredAt: new Date(),
          revoked: true,
          status: 'revoked',
        },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new ForbiddenException(
            `You don't have access to this project. Please try again with a valid project id.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async verifyKey(key: string): Promise<string> {
    try {
      const keyHash = stringHash(key);
      const project = await this.prismaService.project.update({
        where: {
          keyHash,
          revoked: false,
          status: 'active',
        },
        data: {
          usedCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
      return project.id;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new ForbiddenException('Invalid Upload key. Please try again.');
        }
      }
      throw new InternalServerErrorException();
    }
  }
}
