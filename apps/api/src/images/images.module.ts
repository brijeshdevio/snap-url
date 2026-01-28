import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [PrismaModule, StorageModule, ApiKeysModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
