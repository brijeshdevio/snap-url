import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, generateToken, hashPassword } from 'src/utils';
// types
import type { User } from 'src/generated/prisma/client';
import type { Login } from 'src/types';
import type { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * The function `setRefreshToken` asynchronously creates a new refresh token in a database for a
   * specific user with an expiration date set to 7 days from the current date.
   * @param {string} userId - The `userId` parameter in the `setRefreshToken` function is a string that
   * represents the unique identifier of the user for whom the refresh token is being set. This
   * identifier is typically used to associate the refresh token with a specific user in the system.
   * @param {string} hash - The `hash` parameter in the `setRefreshToken` function is a string that
   * represents the hashed value of the refresh token. This hashed value is typically generated using a
   * cryptographic hashing algorithm to securely store and verify the refresh token.
   */
  private async setRefreshToken(userId: string, hash: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        hash,
        expiresAt,
      },
    });
  }

  /**
   * The function `register` asynchronously registers a user by hashing the password, creating a new user
   * in the database, and handling potential conflicts.
   * @param {RegisterDto} registerData - The `registerData` parameter in the `register` function is of
   * type `RegisterDto`, which likely contains data needed to register a new user. This data may include
   * fields such as `email`, `password`, `username`, etc. The function first hashes the password before
   * attempting to create a new
   * @returns The `register` function is returning a Promise that resolves to an object of type
   * `Omit<User, 'password'>`. This means that the function will return a User object without the
   * `password` field after successfully registering the user in the database.
   */
  async register(registerData: RegisterDto): Promise<Omit<User, 'password'>> {
    registerData.password = await hashPassword(registerData.password);
    try {
      const user = await this.prisma.user.create({
        data: registerData,
        omit: { password: true },
      });
      return user;
    } catch (error: unknown) {
      const CONFLICT_ERROR_CODE = 'P2002';
      const err = error as { code: string };
      if (err?.code === CONFLICT_ERROR_CODE) {
        throw new ConflictException(`${registerData.email} already exists.`);
      }

      throw error;
    }
  }

  /**
   * This async function handles user login by verifying credentials, generating tokens, and signing the
   * user in.
   * @param {LoginDto} loginData - The `loginData` parameter in the `login` function is of type
   * `LoginDto`, which likely contains the user's email and password for authentication. It is used to
   * retrieve the user from the database based on the provided email and then validate the password
   * provided in the `loginData` against the
   * @returns The `login` function returns an object with three properties: `accessToken`,
   * `refreshToken`, and `user`.
   */
  async login(loginData: LoginDto): Promise<Login> {
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
    const refreshToken = generateToken();
    await this.setRefreshToken(user.id, refreshToken);
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, refreshToken, user };
  }

  /**
   * The `logout` function asynchronously deletes a refresh token from the database and throws an error
   * if the user is not logged in.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
   * the user who is attempting to log out.
   * @param {string} refreshToken - The `refreshToken` parameter is a string that is used to authenticate
   * a user and obtain a new access token after the original access token expires. It is typically issued
   * by the server to the client during the initial authentication process and is used to maintain the
   * user's session without requiring the user to log in
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    const isLoggedOut = await this.prisma.refreshToken.delete({
      where: { hash: refreshToken, userId },
    });
    if (!isLoggedOut) {
      throw new UnauthorizedException('You are not logged in.');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { hash: refreshToken },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const payload = { id: token.userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
