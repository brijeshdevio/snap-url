import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '@/config/env.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(envConfig.MONGODB_URL), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
