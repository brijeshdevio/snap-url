import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { generateSignKey } from 'src/utils';
import type { SaveImage } from 'src/types';
import { QueryImageDto } from './dto';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private async getSignKey(): Promise<string> {
    const signKey = generateSignKey();
    const isUnique = await this.prisma.image.findUnique({
      where: { signKey },
    });
    if (!isUnique) {
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

  async getImages(userId: string, query: QueryImageDto) {
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
}
