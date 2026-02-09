import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from '../utils';
import type { User } from '../generated/prisma/client';
import type { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDto): Promise<void> {
    registerData.password = await hashPassword(registerData.password);
    try {
      await this.prisma.user.create({
        data: registerData,
        omit: { password: true },
      });
    } catch (error: unknown) {
      const CONFLICT_ERROR_CODE = 'P2002';
      const err = error as { code: string };
      if (err?.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException(`${registerData.email} already exists.`);
      }

      throw error;
    }
  }

  async login(
    loginData: LoginDto,
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginData.email },
    });
    if (!user || !user?.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValidPassword = await comparePassword(
      user?.password,
      loginData.password,
    );
    user.password = undefined as unknown as string;
    if (!isValidPassword && user.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
}
