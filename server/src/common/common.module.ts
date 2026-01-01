import { Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { UploadGuard } from './guard/upload.guard';
import { UploadTokenModule } from '@/upload-token/upload-token.module';

@Module({
  imports: [UploadTokenModule],
  exports: [],
  providers: [AuthGuard, UploadGuard],
})
export class CommonModule {}
