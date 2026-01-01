import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from './user/user.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { UploadTokenModule } from './upload-token/upload-token.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [MongooseModule.forRoot(envConfig.MONGODB_URL), AuthModule, UserModule, ApiKeyModule, UploadTokenModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
