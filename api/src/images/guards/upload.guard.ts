import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from '../../projects/projects.service';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Missing Upload key.');
    }

    try {
      const projectId = await this.projectsService.verifyKey(token);
      request['project'] = { id: projectId };
    } catch {
      throw new ForbiddenException('Invalid or expired Upload key.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers?.['x-upload-key'] as string;
  }
}
