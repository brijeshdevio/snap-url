import crypto from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Secret } from '@/entities/secret.entity';
import { CreateSecretDto } from './dto/create-secret.dto';

@Injectable()
export class SecretService {
  constructor(
    @InjectModel(Secret.name) private readonly secretModel: Model<Secret>,
  ) {}

  private removeSecret(secretHash: string) {
    return `${secretHash.slice(0, 4)}...${secretHash.slice(-3)}`;
  }

  private async generateApiKey(): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const secretHash =
      'ssk_' + crypto.createHash('sha256').update(token).digest('hex');
    const conflictApiKey = await this.secretModel.findOne({ secretHash });
    if (conflictApiKey) {
      return this.generateApiKey();
    }

    return secretHash;
  }

  private isValidId(id: string) {
    if (isValidObjectId(id)) return true;
    throw new BadRequestException(`Invalid secret id ${id}`);
  }

  async create(
    user: string,
    data: CreateSecretDto,
  ): Promise<{ _id: string; secretHash: string }> {
    const secretHash = await this.generateApiKey();

    const conflictApiKeyName = await this.secretModel.findOne({
      user,
      name: data.name,
    });
    if (conflictApiKeyName) {
      throw new ConflictException(
        `Secret with name ${data.name} already exists.`,
      );
    }

    const apiKey = await this.secretModel.create({ user, ...data, secretHash });
    return {
      _id: String(apiKey._id),
      secretHash,
    };
  }

  async getAll(user: string): Promise<Secret[]> {
    const secrets = await this.secretModel
      .find({ user })
      .sort({ createdAt: -1 })
      .select('-__v -updatedAt -user')
      .lean();

    return secrets.map((secret) => ({
      ...secret,
      secretHash: this.removeSecret(secret.secretHash),
    }));
  }

  async disable(user: string, secretId: string): Promise<void> {
    this.isValidId(secretId);

    const disabled = await this.secretModel.findOneAndUpdate(
      { user, _id: secretId },
      { isActive: false },
    );
    if (!disabled) {
      throw new BadRequestException(`Secret with id ${secretId} not found`);
    }
  }

  async enable(user: string, secretId: string): Promise<void> {
    this.isValidId(secretId);

    const enabled = await this.secretModel.findOneAndUpdate(
      { user, _id: secretId },
      { isActive: true },
    );
    if (!enabled) {
      throw new BadRequestException(`Secret with id ${secretId} not found`);
    }
  }

  async revoke(user: string, secretId: string): Promise<void> {
    this.isValidId(secretId);

    const revoked = await this.secretModel.findOneAndUpdate(
      { user, _id: secretId },
      { revokedAt: new Date(), isActive: false },
    );
    if (!revoked) {
      throw new BadRequestException(`Secret with id ${secretId} not found`);
    }
  }

  async delete(user: string, secretId: string): Promise<void> {
    const secret = await this.secretModel.findOneAndDelete({
      user,
      _id: secretId,
    });
    if (secret) return;

    throw new BadRequestException(`Secret with id ${secretId} not found`);
  }

  async verifySecret(secretHash: string): Promise<Secret> {
    const secret = await this.secretModel
      .findOneAndUpdate(
        { secretHash, isActive: true, revokedAt: null },
        { $inc: { usedCount: 1 }, lastUsedAt: Date.now() },
      )
      .select('user')
      .lean();
      
    if (!secret) {
      throw new UnauthorizedException(`Invalid Upload Secret ${secretHash}`);
    }

    return secret;
  }
}
