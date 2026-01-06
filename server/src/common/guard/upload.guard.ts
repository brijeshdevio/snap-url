import { SecretService } from '@/secret/secret.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(private readonly secretService: SecretService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Missing authorization token');
    }
    try {
      const payload = (await this.secretService.verifySecret(
        token,
      )) as unknown as {
        user: string;
        _id: string;
      };
      payload._id = String(payload._id);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['token'] = payload;
    } catch {
      throw new ForbiddenException('Invalid or expired Upload secret');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers?.['x-upload-token'] as string;
  }
}
