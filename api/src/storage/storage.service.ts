// storage.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { envConfig, storage } from 'src/config';
// types
import type { Storage } from 'node-appwrite';

type UploadImage = {
  storage: string;
  name: string;
  size: number;
  mimeType: string;
};

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = storage;
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadImage> {
    try {
      const inputFile = InputFile.fromBuffer(file.buffer, file.originalname);

      const result = await this.storage.createFile({
        bucketId: envConfig.APPWRITE_BUCKET_ID,
        fileId: ID.unique(),
        file: inputFile,
      });

      return {
        storage: result.$id,
        name: result.name,
        size: result.sizeOriginal,
        mimeType: result.mimeType,
      };
    } catch (error: any) {
      throw new BadRequestException(`Failed to upload file: ${error?.message}`);
    }
  }

  async viewImage(fileId: string): Promise<ArrayBuffer> {
    const file = await this.storage.getFileView({
      bucketId: envConfig.APPWRITE_BUCKET_ID,
      fileId,
    });
    return file;
  }
}
