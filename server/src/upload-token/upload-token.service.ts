import crypto from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UploadToken } from '@/entities/upload-token.entity';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class UploadTokenService {
  constructor(
    @InjectModel(UploadToken.name)
    private readonly uploadTokenModel: Model<UploadToken>,
  ) {}

  private async generateApiKey(): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const tokenHash =
      'upl_live_' + crypto.createHash('sha256').update(token).digest('hex');
    const conflictApiKey = await this.uploadTokenModel.findOne({ tokenHash });
    if (conflictApiKey) {
      return this.generateApiKey();
    }
    return tokenHash;
  }

  private isValidId(id: string) {
    if (isValidObjectId(id)) return true;
    throw new BadRequestException(`Invalid api key id ${id}`);
  }

  async create(
    user: string,
    apiKey: string,
    data: CreateTokenDto,
  ): Promise<{ token: string; expiresAt: Date | null }> {
    this.isValidId(apiKey);

    const tokenHash = await this.generateApiKey();
    const uploadToken = await this.uploadTokenModel.create({
      user,
      apiKey,
      tokenHash,
      ...data,
    });
    return {
      token: tokenHash,
      expiresAt: uploadToken.expiresAt,
    };
  }

  async verifyToken(tokenHash: string): Promise<UploadToken> {
    const token = await this.uploadTokenModel
      .findOne({ tokenHash, isActive: true })
      .select('user apiKey purpose')
      .lean();
    if (!token) {
      throw new UnauthorizedException(`Invalid Upload Token ${tokenHash}`);
    }

    return token;
  }
}
