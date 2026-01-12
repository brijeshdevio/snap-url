import crypto from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { User } from '@/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { verifyEmail } from '@/email-templates';

type ProviderData = {
  authProvider: 'github' | 'google';
  authId: string;
  email: string;
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private generateEmailVerificationToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateRefreshToken(): string {
    const token = crypto.randomBytes(64).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async signup(data: SignupDto): Promise<any> {
    try {
      data.password = await argon2.hash(data.password);
      const emailVerificationToken = this.generateEmailVerificationToken();
      const emailVerificationExpires = new Date();
      emailVerificationExpires.setMinutes(
        emailVerificationExpires.getMinutes() + 5,
      );

      await this.userModel.create({
        ...data,
        emailVerificationToken,
        emailVerificationExpires,
        isEmailVerified: false,
      });
      await verifyEmail(data.email, data.name, emailVerificationToken);
      return { name: data.name, email: data.email };
    } catch (error: unknown) {
      const CONFLICT_ERROR_CODE = 11000;
      const err = error as { code: number };
      if (err.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException(`Email ${data.email} already exists`);
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      {
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
        isEmailVerified: false,
      },
      { isEmailVerified: true, emailVerificationToken: null },
    );

    if (user) {
      return user;
    }

    throw new UnauthorizedException('Invalid verification token.');
  }

  async login(data: LoginDto): Promise<any> {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Email not verified.');
    }

    if (!user.password) {
      throw new ForbiddenException("You don't have this account.");
    }

    const isPasswordValid = await argon2.verify(user?.password, data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const refreshToken = this.generateRefreshToken();
    const accessToken = await this.generateToken({ id: String(user._id) });
    user.refreshToken = refreshToken;

    await user.save();
    const expiresIn = 3600;
    return { accessToken, refreshToken, expiresIn };
  }

  async logout(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: '' } },
    );
  }

  async refresh(token: string) {
    const user = await this.userModel.findOne({ refreshToken: token });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const refreshToken = this.generateRefreshToken();
    const accessToken = await this.generateToken({ id: String(user._id) });
    user.refreshToken = refreshToken;

    await user.save();
    const expiresIn = 3600;
    return { accessToken, refreshToken, expiresIn };
  }

  async findOrCreateUser(data: ProviderData) {
    const user = await this.userModel.findOne({
      authProvider: data.authProvider,
      authId: data.authId,
    });

    if (user) {
      const refreshToken = this.generateRefreshToken();
      const accessToken = await this.generateToken({ id: String(user._id) });
      user.refreshToken = refreshToken;

      await user.save();
      const expiresIn = 3600;
      return { accessToken, refreshToken, expiresIn };
    }

    const newUser = await this.userModel.create(data);

    const refreshToken = this.generateRefreshToken();
    const accessToken = await this.generateToken({ id: String(newUser._id) });
    newUser.refreshToken = refreshToken;
    newUser.isEmailVerified = true;

    await newUser.save();
    const expiresIn = 3600;
    return { accessToken, refreshToken, expiresIn };
  }
}
