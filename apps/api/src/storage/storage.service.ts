// storage.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { envConfig, storage } from 'src/config';
// types
import type { Storage } from 'node-appwrite';

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = storage;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const inputFile = InputFile.fromBuffer(file.buffer, file.originalname);

      const result = await this.storage.createFile({
        bucketId: envConfig.APPWRITE_BUCKET_ID,
        fileId: ID.unique(),
        file: inputFile,
      });

      return {
        imgToken: result.$id,
        name: result.name,
        size: result.sizeOriginal,
        mimeType: result.mimeType,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }
}
