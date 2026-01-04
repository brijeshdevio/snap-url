import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { SecretModule } from '@/secret/secret.module';
import { ImageModule } from '@/image/image.module';
import { UploadModule } from '@/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.MONGODB_URL),
    AuthModule,
    UserModule,
    SecretModule,
    ImageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
