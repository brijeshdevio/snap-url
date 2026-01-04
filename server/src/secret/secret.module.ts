import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Secret, SecretSchema } from '@/entities/secret.entity';
import { SecretService } from './secret.service';
import { SecretController } from './secret.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Secret.name, schema: SecretSchema }]),
  ],
  controllers: [SecretController],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
