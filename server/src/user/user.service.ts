import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async checkAndAddStorageSize(userId: string, size: number): Promise<void> {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new UnauthorizedException('You are not authorized.');
    }

    if (user && user.storageUsed + size > user.storage) {
      throw new UnauthorizedException('You have reached your storage limit.');
    }

    await this.addStorageSize(userId, size);
  }

  async addStorageSize(userId: string, size: number): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { usedQuota: size } },
    );
  }

  async reduceStorageSize(userId: string, size: number): Promise<void> {
    if (size <= 0) return;

    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { usedQuota: -size } },
    );
  }

  async changeEmail(userId: string, newEmail: string): Promise<void> {
    const isEmailTaken = await this.userModel.exists({ email: newEmail });
    if (isEmailTaken) {
      throw new ConflictException('Email is already taken');
    }

    await this.userModel.findOneAndUpdate({ _id: userId }, { email: newEmail });
  }
}
