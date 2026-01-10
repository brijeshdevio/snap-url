import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import argon2 from 'argon2';
import { Secret } from '@/entities/secret.entity';
import { Image } from '@/entities/image.entity';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Secret.name) private readonly secretModel: Model<Secret>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
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

  async update(userId: string, updateData: UpdateDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { name: updateData.name },
        {
          new: true,
        },
      )
      .select('name')
      .lean();
    if (user) {
      return user;
    }

    throw new UnauthorizedException('You are not authorized');
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        {
          new: true,
        },
      )
      .select('avatar')
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

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userModel.findById(userId).select('password');
    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }

    if (user?.password) {
      const isValidPassword = await argon2.verify(user.password, oldPassword);
      if (!isValidPassword) {
        throw new BadRequestException('Old password is incorrect');
      }
    }

    const hashedPassword = await argon2.hash(newPassword);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword },
    );
  }

  async deleteAccount(userId: string): Promise<void> {
    const isDeleted = await this.userModel.findOneAndDelete({ _id: userId });
    if (isDeleted) {
      await this.secretModel.deleteMany({ user: userId });
      await this.imageModel.deleteMany({ user: userId });
      return;
    }

    throw new UnauthorizedException(
      'You are not authorized to delete this account',
    );
  }
}
