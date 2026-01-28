import { ApiKeysService } from 'src/api-keys/api-keys.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FileUploadGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Missing API Key.');
    }
    try {
      const apiKey = await this.apiKeysService.verifyToken(token);
      request['apiKey'] = apiKey;
    } catch {
      throw new ForbiddenException('Invalid or expired Upload secret');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers?.['x-upload-token'] as string;
  }
}
