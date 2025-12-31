import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from './user/user.module';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [MongooseModule.forRoot(envConfig.MONGODB_URL), AuthModule, UserModule, ApiKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
