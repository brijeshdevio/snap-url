import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
    request['auth'] = { refreshToken };
    return true;
  }
}
