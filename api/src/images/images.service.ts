import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PRISMA_ERROR_CODES } from '../constants';
import { randomString } from '../lib';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
} from './images.types';

@Injectable()
export class ImagesService {
  private prefix = 'img_';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private generateImageId() {
    return this.prefix + randomString(6);
  }

  async upload(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<CreateResponse> {
    try {
      const imgId = this.generateImageId();
      const uploadedImage = await this.storageService.upload(imgId, file);
      await this.prismaService.image.create({
        data: {
          name: uploadedImage.name,
          storage: uploadedImage.$id,
          mimeType: uploadedImage.mimeType,
          size: uploadedImage.sizeOriginal,
          projectId: projectId,
          key: imgId,
        },
      });
      return {
        id: imgId,
        name: uploadedImage.name,
        mimeType: uploadedImage.mimeType,
        size: uploadedImage.sizeOriginal,
        createdAt: uploadedImage.$createdAt,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new ForbiddenException(
            `You don't have access to this upload api key.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string): Promise<FindAllResponse> {
    const images = await this.prismaService.image.findMany({
      where: { project: { userId } },
      select: {
        id: true,
        key: true,
        name: true,
        size: true,
        mimeType: true,
        createdAt: true,
      },
    });
    return { images };
  }

  async findOne(userId: string, id: string): Promise<FindOneResponse> {
    const image = await this.prismaService.image.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
      omit: {
        projectId: true,
        storage: true,
      },
    });
    if (image) return image;
    throw new ForbiddenException(
      `You don't have access to this Image. Please try again with a valid Image id.`,
    );
  }

  async preview(imgId: string): Promise<ArrayBuffer> {
    return await this.storageService.preview(imgId);
  }

  async delete(userId: string, id: string): Promise<void> {
    try {
      await this.prismaService.image.update({
        where: { id, project: { userId }, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new ForbiddenException(
            `You don't have access to this Image. Please try again with a valid project id.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }
}
