import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { ProjectsModule } from '../projects/projects.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [PrismaModule, StorageModule, ProjectsModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
