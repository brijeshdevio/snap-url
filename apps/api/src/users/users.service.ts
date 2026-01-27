import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// types
import type { User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * This TypeScript function retrieves a user profile by ID while omitting the password field, returning
   * a Promise with the user data or throwing an UnauthorizedException if the user is not logged in.
   * @param {string} userId - The `userId` parameter in the `getProfile` function is a string that
   * represents the unique identifier of the user whose profile we want to retrieve.
   * @returns The `getProfile` function returns a Promise that resolves to a user object with the
   * password field omitted. The `Omit<User, 'password'>` type indicates that the returned user object
   * will not include the 'password' field from the original User type. If the user is found in the
   * database, the function returns the user object. If the user is not found, it throws an
   * UnauthorizedException
   */
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });
    if (user) return user;
    throw new UnauthorizedException('You are not logged in.');
  }
}
