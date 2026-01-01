import { Module } from '@nestjs/common';
import { UploadTokenService } from './upload-token.service';
import { UploadTokenController } from './upload-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadToken, UploadTokenSchema } from '@/entities/upload-token.entity';
import { UserModule } from '@/user/user.module';
import { ImageModule } from '@/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadToken.name, schema: UploadTokenSchema },
    ]),
    UserModule,
    ImageModule,
  ],
  exports: [UploadTokenService],
  controllers: [UploadTokenController],
  providers: [UploadTokenService],
})
export class UploadTokenModule {}
