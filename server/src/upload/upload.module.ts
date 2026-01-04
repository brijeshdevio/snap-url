import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { ImageModule } from '@/image/image.module';
import { SecretModule } from '@/secret/secret.module';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [UserModule, ImageModule, SecretModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
