import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from '../utils';
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

    const accessToken = await this.generateAccessToken(safeUser.id);
    return { accessToken, user: safeUser };
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
}
