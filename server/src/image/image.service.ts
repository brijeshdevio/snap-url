import crypto from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '@/entities/image.entity';
import { ImageRequest } from '@/types';
import { cloudinary } from '@/config/cloudinary.config';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  private async generateImageTokenKey(): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const imageTokenHash =
      'img_' + crypto.createHash('sha256').update(token).digest('hex');
    const conflictImageToken = await this.imageModel.findOne({
      imageTokenHash,
    });
    if (conflictImageToken) {
      return await this.generateImageTokenKey();
    }
    return imageTokenHash;
  }

  async upload(auth: ImageRequest['token'], data: any) {
    const imageTokenHash = await this.generateImageTokenKey();

    await this.imageModel.create({
      ...data,
      user: auth.user,
      secret: auth._id,
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
      .select('-__v -user -updatedAt -secret -width -height -url')
      .lean();
    return images;
  }

  async deleteImage(imageTokenHash: string): Promise<void> {
    const deletedImage = await this.imageModel.findOne({
      imageTokenHash,
    });

    if (deletedImage) {
      await cloudinary.uploader.destroy(deletedImage.publicId);
      await this.imageModel.deleteOne({ imageTokenHash });
      return;
    }

    throw new UnauthorizedException(
      `You are not authorized to delete this image`,
    );
  }
}
