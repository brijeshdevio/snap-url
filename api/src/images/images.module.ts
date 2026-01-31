import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [PrismaModule, StorageModule, ProjectsModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
