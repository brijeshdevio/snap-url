import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { COOKIE_NAME } from '../../constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[COOKIE_NAME.REFRESH_TOKEN] as string;
    if (!token) {
      throw new UnauthorizedException('Missing refresh token.');
    }

    try {
      request[COOKIE_NAME.REFRESH_TOKEN] = token;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }
}
