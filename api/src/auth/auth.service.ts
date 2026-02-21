import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  comparePassword,
  hashPassword,
  randomString,
  stringHash,
} from '../lib';
import { DUMMY_HASH, PRISMA_ERROR_CODES } from '../constants';
import {
  FindOrCreateUserDto,
  LoginDto,
  LoginResponse,
  RefreshResponse,
  RegisterDto,
} from './auth.types';

@Injectable()
export class AuthService {
  private readonly Day = new Date(Date.now() + 24 * 60 * 60 * 1000);
  private readonly Week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async refreshToken(userId: string): Promise<string> {
    const refreshToken = randomString();
    const tokenHash = stringHash(refreshToken);
    await this.prisma.session.create({
      data: {
        userId,
        expiresAt: this.Week,
        refreshTokens: {
          create: {
            tokenHash,
            expiresAt: this.Day,
          },
        },
      },
    });
    return refreshToken;
  }

  private async accessToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({
      sub: userId,
      type: 'access',
    });
  }

  async register(data: RegisterDto): Promise<void> {
    try {
      const passwordHash = await hashPassword(data.password);
      await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
        },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.CONFLICT) {
          throw new ConflictException(
            `${data.email} already exists. Please try a different email.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    const passwordToCheck: string = user?.passwordHash ?? DUMMY_HASH;
    const isPasswordValid = await comparePassword(
      passwordToCheck,
      data.password,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const refreshToken = await this.refreshToken(user.id);
    const accessToken = await this.accessToken(user.id);
    return { accessToken, refreshToken };
  }

  async refresh(token: string): Promise<RefreshResponse> {
    try {
      const tokenHash = stringHash(token);
      const refreshToken = randomString();
      const newTokenHash = stringHash(refreshToken);
      const { session } = await this.prisma.refreshToken.update({
        where: {
          tokenHash,
          expiresAt: { gt: new Date() },
          session: {
            expiresAt: { gt: new Date() },
          },
        },
        data: {
          tokenHash: newTokenHash,
          expiresAt: this.Day,
        },
        select: { session: { select: { user: { select: { id: true } } } } },
      });

      const accessToken = await this.accessToken(session.user.id);

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
          throw new UnauthorizedException(
            'Invalid or expired refresh token. Please login again.',
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async logout(token: string): Promise<void> {
    const tokenHash = stringHash(token);
    await this.prisma.session.deleteMany({
      where: {
        refreshTokens: {
          some: {
            tokenHash,
          },
        },
      },
    });
  }

  async findOrCreateUser(data: FindOrCreateUserDto): Promise<RefreshResponse> {
    const refreshToken = randomString();
    const tokenHash = stringHash(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { email: data.email, authId: data.authId },
      select: {
        id: true,
      },
    });
    if (user) {
      const accessToken = await this.accessToken(user.id);
      const refreshToken = await this.refreshToken(user.id);
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

    const accessToken = await this.accessToken(newUser.id);
    return { accessToken, refreshToken };
  }
}
