import crypto from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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

  private isValidId(id: string) {
    if (isValidObjectId(id)) return true;
    throw new BadRequestException(`Invalid api key id ${id}`);
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

  async getAll(user: string): Promise<ApiKey[]> {
    const apiKeys = await this.apiKeyModel
      .find({ user })
      .sort({ createdAt: -1 })
      .select('name isActive lastUsedAt revokedAt')
      .lean();

    return apiKeys;
  }

  async disable(user: string, apiKeyId: string): Promise<void> {
    this.isValidId(apiKeyId);

    const disabled = await this.apiKeyModel.findOneAndUpdate(
      { user, _id: apiKeyId },
      { isActive: false },
    );
    if (!disabled) {
      throw new BadRequestException(`Api key with id ${apiKeyId} not found`);
    }
  }

  async enable(user: string, apiKeyId: string): Promise<void> {
    this.isValidId(apiKeyId);

    const enabled = await this.apiKeyModel.findOneAndUpdate(
      { user, _id: apiKeyId },
      { isActive: true },
    );
    if (!enabled) {
      throw new BadRequestException(`Api key with id ${apiKeyId} not found`);
    }
  }

  async revoke(user: string, apiKeyId: string): Promise<void> {
    this.isValidId(apiKeyId);

    const revoked = await this.apiKeyModel.findOneAndUpdate(
      { user, _id: apiKeyId },
      { revokedAt: new Date(), isActive: false },
    );
    if (!revoked) {
      throw new BadRequestException(`Api key with id ${apiKeyId} not found`);
    }
  }
}
