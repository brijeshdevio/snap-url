import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { generateSignKey } from 'src/utils';
import type { SaveImage } from 'src/types';
import type { QueryImageDto } from './dto';
import { Image } from 'src/generated/prisma/client';

type ImagesResponse = {
  images: Omit<Image, 'userId' | 'storage'>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private async getSignKey(): Promise<string> {
    const signKey = generateSignKey();
    const existingSignKey = await this.prisma.image.findUnique({
      where: { signKey },
    });
    if (existingSignKey) {
      return await this.getSignKey();
    }
    return signKey;
  }

  async saveImage(
    userId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<SaveImage> {
    const { storage, ...uploadedImage } =
      await this.storageService.uploadImage(file);
    const signKey = await this.getSignKey();
    await this.prisma.image.create({
      data: {
        signKey,
        userId,
        projectId,
        storage,
        ...uploadedImage,
      },
    });
    return { ...uploadedImage, signKey };
  }

  async getImages(
    userId: string,
    query: QueryImageDto,
  ): Promise<ImagesResponse> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.q && { name: { contains: query.q } }),
    };

    const [images, total] = await Promise.all([
      this.prisma.image.findMany({
        where,
        omit: { userId: true, storage: true },
        skip,
        take: limit,
      }),
      this.prisma.image.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      images,
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

  async viewImage(signKey: string): Promise<ArrayBuffer> {
    const image = await this.prisma.image.findUnique({ where: { signKey } });
    if (!image) {
      throw new NotFoundException(`Image not found.`);
    }

    const file = await this.storageService.viewImage(image.storage);
    return file;
  }

  async deleteImage(userId: string, imageId: string): Promise<Image> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { userId, id: imageId },
      });
      if (image && image.storage) {
        await this.storageService.deleteImage(image.storage);
        await this.prisma.image.delete({ where: { userId, id: imageId } });
        return image;
      }

      throw new NotFoundException(`Image with id ${imageId} not found.`);
    } catch (error: unknown) {
      const NOT_FOUND_CODE = 'P2025';
      const err = error as { code: string };
      if (err?.code === NOT_FOUND_CODE) {
        throw new NotFoundException(`Image with id ${imageId} not found.`);
      }
      throw error;
    }
  }
}
