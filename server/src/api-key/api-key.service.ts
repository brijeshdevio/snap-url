import crypto from 'node:crypto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey } from '@/entities/api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>,
  ) {}

  private async generateApiKey(): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const keyHash = crypto.createHash('sha256').update(token).digest('hex');
    const conflictApiKey = await this.apiKeyModel.findOne({ keyHash });
    if (conflictApiKey) {
      return this.generateApiKey();
    }
    return keyHash;
  }

  async create(
    user: string,
    data: CreateApiKeyDto,
  ): Promise<{ _id: string; keyHash: string }> {
    const keyHash = await this.generateApiKey();

    const conflictApiKeyName = await this.apiKeyModel.findOne({
      user,
      name: data.name,
    });
    if (conflictApiKeyName) {
      throw new ConflictException(
        `Api key with name ${data.name} already exists`,
      );
    }

    const apiKey = await this.apiKeyModel.create({ user, ...data, keyHash });
    return {
      _id: String(apiKey._id),
      keyHash,
    };
  }
}
