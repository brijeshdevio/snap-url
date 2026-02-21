import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const ProjectId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const projectId = request['project']?.['id'] as string;

    if (!projectId) {
      throw new ForbiddenException('Invalid or expired upload api key.');
    }

    return projectId;
  },
);
