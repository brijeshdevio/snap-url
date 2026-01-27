import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateApiKey } from 'src/utils';
// types
import type { ApiKey } from 'src/generated/prisma/client';
import type { CreateApiKeyDto } from './dto';

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

  async getAllKeys(userId: string): Promise<ApiKey[]> {
    const keys = await this.prisma.apiKey.findMany({ where: { userId } });
    return keys.map((key) => ({
      ...key,
      tokenHash: this.removeToken(key.tokenHash),
    }));
  }

  async revokeKey(userId: string, apiKeyId: string): Promise<void> {
    try {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId, userId, revoked: false },
        data: { revoked: true },
      });
    } catch (error: unknown) {
      const NOT_FOUND_ERROR = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_ERROR) {
        throw new BadRequestException(`API key with id ${apiKeyId} not found.`);
      }
      throw error;
    }
  }

  async deleteKey(userId: string, apiKeyId: string): Promise<void> {
    try {
      await this.prisma.apiKey.delete({ where: { userId, id: apiKeyId } });
    } catch (error: unknown) {
      const NOT_FOUND_ERROR = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_ERROR) {
        throw new BadRequestException(`API key with id ${apiKeyId} not found.`);
      }
      throw error;
    }
  }
}
