import { Module } from '@nestjs/common';
import { UploadTokenService } from './upload-token.service';
import { UploadTokenController } from './upload-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadToken, UploadTokenSchema } from '@/entities/upload-token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadToken.name, schema: UploadTokenSchema },
    ]),
  ],
  controllers: [UploadTokenController],
  providers: [UploadTokenService],
})
export class UploadTokenModule {}
