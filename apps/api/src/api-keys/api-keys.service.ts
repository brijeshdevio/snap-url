import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateApiKey } from 'src/utils';
// types
import type { ApiKey } from 'src/generated/prisma/client';
import type { CreateApiKeyDto, QueryApiKeyDto, UpdateApiKeyDto } from './dto';
import { ApiKeys } from 'src/types';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueToken(): Promise<string> {
    const token = generateApiKey();
    const existingKey = await this.prisma.apiKey.findUnique({
      where: { tokenHash: token },
      select: { tokenHash: true },
    });
    if (existingKey) {
      return await this.generateUniqueToken();
    }
    return token;
  }

  private async validateNameUniqueness(
    userId: string,
    name: string,
  ): Promise<void> {
    const existingKey = await this.prisma.apiKey.findFirst({
      where: { userId, name },
    });
    if (existingKey) {
      throw new ConflictException(
        `API key with name "${name}" already exists.`,
      );
    }
  }

  private removeToken(tokenHash: string) {
    return `${tokenHash.slice(0, 4)}...${tokenHash.slice(-3)}`;
  }

  async createKey(
    userId: string,
    apiKeyData: CreateApiKeyDto,
  ): Promise<ApiKey> {
    await this.validateNameUniqueness(userId, apiKeyData.name);
    const tokenHash = await this.generateUniqueToken();
    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        tokenHash,
        name: apiKeyData.name,
      },
    });
    return apiKey;
  }

  async getAllKeys(userId: string, query: QueryApiKeyDto): Promise<ApiKeys> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.q && { name: { contains: query.q } }),
    };

    const [keys, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        where,
        omit: { userId: true },
        skip,
        take: limit,
      }),
      this.prisma.apiKey.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      apiKeys: keys.map((key) => ({
        ...key,
        tokenHash: this.removeToken(key.tokenHash),
      })),
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

  async renameKey(
    userId: string,
    apiKeyId: string,
    apiKeyData: UpdateApiKeyDto,
  ): Promise<Omit<ApiKey, 'tokenHash'>> {
    await this.validateNameUniqueness(userId, apiKeyData.name);

    try {
      const apiKey = await this.prisma.apiKey.update({
        where: { userId, id: apiKeyId },
        data: { name: apiKeyData.name },
        omit: { tokenHash: true },
      });
      return apiKey;
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new BadRequestException(`API key with id ${apiKeyId} not found.`);
      }
      throw error;
    }
  }

  async revokeKey(userId: string, apiKeyId: string): Promise<void> {
    try {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId, userId, revoked: false },
        data: { revoked: true },
      });
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new BadRequestException(`API key with id ${apiKeyId} not found.`);
      }
      throw error;
    }
  }

  async deleteKey(userId: string, apiKeyId: string): Promise<void> {
    try {
      await this.prisma.apiKey.delete({ where: { userId, id: apiKeyId } });
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new BadRequestException(`API key with id ${apiKeyId} not found.`);
      }
      throw error;
    }
  }
}
