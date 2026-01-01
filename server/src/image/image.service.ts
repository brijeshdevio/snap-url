import crypto from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '@/entities/image.entity';
import { UploadImageRequest } from '@/types';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  private async generateApiKey(): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const imageTokenHash =
      'img_live_' + crypto.createHash('sha256').update(token).digest('hex');
    const conflictApiKey = await this.imageModel.findOne({ imageTokenHash });
    if (conflictApiKey) {
      return this.generateApiKey();
    }
    return imageTokenHash;
  }

  async upload(auth: UploadImageRequest['token'], data: any) {
    const imageTokenHash = await this.generateApiKey();

    await this.imageModel.create({
      ...data,
      user: auth.user,
      apiKey: auth.apiKey,
      uploadToken: auth._id,
      purpose: auth.purpose,
      imageTokenHash,
    });

    return imageTokenHash;
  }

  async getImageUrl(displayName: string): Promise<string> {
    const image = await this.imageModel
      .findOne({ displayName })
      .select('url')
      .lean();
    if (image) {
      return image.url;
    }

    throw new NotFoundException('Image not found');
  }

  async getAll(user: string): Promise<Image[]> {
    const images = await this.imageModel
      .find({ user })
      .sort({ createdAt: -1 })
      .select('imageTokenHash displayName purpose size createdAt')
      .lean()
      .lean();
    return images;
  }
}
