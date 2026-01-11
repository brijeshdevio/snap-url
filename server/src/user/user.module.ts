import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/entities/user.entity';
import { Secret, SecretSchema } from '@/entities/secret.entity';
import { Image, ImageSchema } from '@/entities/image.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Secret.name, schema: SecretSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
