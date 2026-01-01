import { UploadTokenService } from '@/upload-token/upload-token.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(private readonly uploadTokenService: UploadTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Missing authorization token');
    }
    try {
      const payload = await this.uploadTokenService.verifyToken(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['token'] = payload;
    } catch {
      throw new ForbiddenException('Invalid or expired Upload token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers?.['x-upload-token'] as string;
  }
}
