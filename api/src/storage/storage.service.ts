import { Injectable } from '@nestjs/common';
import { AppwriteException, Models } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { envConfig, storage } from '../config';

@Injectable()
export class Appwrite {
  private storage = storage;

  async upload(
    fileId: string,
    inputImage: Express.Multer.File,
  ): Promise<Models.File> {
    const file = InputFile.fromBuffer(
      inputImage.buffer,
      inputImage.originalname,
    );
    return await this.storage.createFile({
      bucketId: envConfig.APPWRITE_BUCKET_ID,
      file,
      fileId,
    });
  }

  async preview(imageId: string): Promise<ArrayBuffer> {
    try {
      return await this.storage.getFileView(
        envConfig.APPWRITE_BUCKET_ID,
        imageId,
      );
    } catch (error: unknown) {
      if (error instanceof AppwriteException) {
        return await this.storage.getFileView(
          envConfig.APPWRITE_BUCKET_ID,
          envConfig.APPWRITE_NOT_FOUND,
        );
      }
      return await this.storage.getFileView(
        envConfig.APPWRITE_BUCKET_ID,
        envConfig.APPWRITE_NOT_FOUND,
      );
    }
  }
}

@Injectable()
export class StorageService {
  constructor(private readonly storage: Appwrite) {}

  async upload(
    fileId: string,
    file: Express.Multer.File,
  ): Promise<Models.File> {
    return await this.storage.upload(fileId, file);
  }

  async preview(imageId: string): Promise<ArrayBuffer> {
    return await this.storage.preview(imageId);
  }
}
