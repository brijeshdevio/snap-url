import { Module } from '@nestjs/common';
import { SecretModule } from '@/secret/secret.module';
import { UploadGuard } from './guard/upload.guard';

@Module({
  imports: [SecretModule],
  exports: [UploadGuard],
  providers: [UploadGuard],
})
export class CommonModule {}
