import { ConflictException, Injectable } from '@nestjs/common';
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
}
