import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
// types
import type { Image } from 'src/generated/prisma/client';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadImage(
    { userId, apiKeyId },
    file: Express.Multer.File,
  ): Promise<any> {
    const image = await this.storageService.uploadFile(file);

    await this.prisma.image.create({
      data: {
        userId,
        apiKeyId,
        ...image,
      },
    });

    return image;
  }

  async getImagesByUserId(
    userId: string,
  ): Promise<Omit<Image, 'userId' | 'apiKeyId'>[]> {
    const images = await this.prisma.image.findMany({
      where: { userId },
      omit: { userId: true, apiKeyId: true },
    });
    return images;
  }
}
