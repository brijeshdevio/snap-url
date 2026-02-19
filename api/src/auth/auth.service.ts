import { randomBytes, createHash } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from '../utils';
import { PRISMA_ERROR_CODES } from '../constants';
import type { LoginDto, RegisterDto } from './dto';
import {
  FindOrCreateUserDto,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly Day = new Date(Date.now() + 24 * 60 * 60 * 1000);
  private readonly Week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
    try {
      const passwordHash = await hashPassword(data.password);
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
        },
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
        passwordHash: true,
      },
    });
    if (!user || !user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const { passwordHash, ...safeUser } = user;

    const isValidPassword = await comparePassword(passwordHash, data.password);
    if (!isValidPassword && passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const refreshToken = this.randomString();
    const tokenHash = this.tokenHash(refreshToken);
    await this.prisma.session.create({
      data: {
        userId: safeUser.id,
        expiresAt: this.Week,
        refreshTokens: {
          create: {
            tokenHash,
            expiresAt: this.Day,
          },
        },
      },
    });
    const accessToken = await this.generateAccessToken(safeUser.id);
    return { accessToken, user: safeUser, refreshToken };
  }

  async findOrCreateUser(data: FindOrCreateUserDto): Promise<RefreshResponse> {
    const refreshToken = this.randomString();
    const tokenHash = this.tokenHash(refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { email: data.email, authId: data.authId },
      select: {
        id: true,
      },
    });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          sessions: {
            create: {
              expiresAt: this.Week,
              refreshTokens: {
                create: {
                  tokenHash,
                  expiresAt: this.Day,
                },
              },
            },
          },
        },
      });
      const accessToken = await this.generateAccessToken(user.id);
      return { accessToken, refreshToken };
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        authProvider: data.authProvider,
        authId: data.authId,
        sessions: {
          create: {
            expiresAt: this.Week,
            refreshTokens: {
              create: {
                tokenHash,
                expiresAt: this.Day,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    const accessToken = await this.generateAccessToken(newUser.id);
    return { accessToken, refreshToken };
  }

  async refresh(token: string): Promise<RefreshResponse> {
    try {
      const decodedTokenHash = this.tokenHash(token);
      const newRefreshToken = this.randomString();
      const newTokenHash = this.tokenHash(newRefreshToken);

      const refreshToken = await this.prisma.refreshToken.update({
        where: {
          expiresAt: { gt: new Date() },
          tokenHash: decodedTokenHash,
          session: {
            expiresAt: { gt: new Date() },
          },
        },
        data: {
          expiresAt: this.Day,
          tokenHash: newTokenHash,
        },
        select: {
          session: {
            select: {
              userId: true,
            },
          },
        },
      });
      const accessToken = await this.generateAccessToken(
        refreshToken.session.userId,
      );
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new ForbiddenException('Invalid or expired refresh token.');
        }
      }
      throw new InternalServerErrorException('Failed to rotate refresh token.');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: { gt: new Date() },
        userId,
      },
    });
  }
}
