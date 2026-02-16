import { randomBytes, createHash } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from '../utils';
import { EXPIRED_REFRESH_TOKEN } from '../constants';
import type { LoginDto, RegisterDto } from './dto';
import {
  FindOrCreateUserDto,
  LoginResponse,
  RegisterResponse,
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private randomString(): string {
    return randomBytes(128).toString('hex');
  }

  private tokenHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async generateAccessToken(userId: string): Promise<string> {
    const payload = { id: userId };
    return await this.jwtService.signAsync(payload);
  }

  async register(data: RegisterDto): Promise<RegisterResponse> {
    data.password = await hashPassword(data.password);
    try {
      return await this.prisma.user.create({
        data: data,
        select: { id: true, email: true, name: true, createdAt: true },
      });
    } catch (error: unknown) {
      const CONFLICT_ERROR_CODE = 'P2002';
      const err = error as { code: string };
      if (err?.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException(`${data.email} already exists.`);
      }

      throw error;
    }
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        password: true,
      },
    });
    if (!user || !user?.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const { password, ...safeUser } = user;

    const isValidPassword = await comparePassword(password, data.password);
    if (!isValidPassword && password) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const refreshToken = this.randomString();
    const tokenHash = this.tokenHash(refreshToken);
    const expiresAt = new Date(Date.now() + EXPIRED_REFRESH_TOKEN);
    await this.prisma.user.update({
      where: { id: safeUser.id },
      data: {
        refreshTokens: {
          create: {
            tokenHash,
            expiresAt,
          },
        },
      },
    });
    const accessToken = await this.generateAccessToken(safeUser.id);
    return { accessToken, user: safeUser, refreshToken };
  }

  async findOrCreateUser(
    data: FindOrCreateUserDto,
  ): Promise<LoginResponse['accessToken']> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email, authId: data.authId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    if (user) {
      return await this.generateAccessToken(user.id);
    }

    const userData = {
      email: data.email,
      name: data.name,
      authProvider: data.authProvider,
      authId: data.authId,
    };
    const newUser = await this.prisma.user.create({
      data: userData,
      select: {
        id: true,
      },
    });
    return await this.generateAccessToken(newUser.id);
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    const tokenHash = this.tokenHash(token);
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
      select: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
    if (!refreshToken) {
      throw new UnauthorizedException(`Invalid or expired refresh token.`);
    }

    const accessToken = await this.generateAccessToken(refreshToken.user.id);

    return { accessToken };
  }
}
