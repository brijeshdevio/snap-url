import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findMe(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('name email plan createdAt avatar')
      .lean();
    if (user) {
      return user;
    }

    throw new UnauthorizedException('You are not authorized');
  }
}
