import { Module } from '@nestjs/common';
import { Appwrite, StorageService } from './storage.service';

@Module({
  providers: [StorageService, Appwrite],
  exports: [StorageService],
})
export class StorageModule {}
