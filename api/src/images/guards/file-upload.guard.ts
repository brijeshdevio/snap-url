import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class FileUploadGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Missing Upload key.');
    }

    try {
      const project = await this.projectsService.verifyUploadKey(token);
      request['project'] = project;
    } catch {
      throw new ForbiddenException('Invalid or expired Upload key.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers?.['x-upload-key'] as string;
  }
}
