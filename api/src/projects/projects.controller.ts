import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards';
import { ZodValidationPipe } from 'src/common/pipes';
import { apiResponse } from 'src/utils';
import { ProjectsService } from './projects.service';
import {
  CreateProjectSchema,
  QueryProjectSchema,
  UpdateProjectSchema,
} from './dto';
import type { Response } from 'express';
import type { CurrentUser } from 'src/types';
import type {
  CreateProjectDto,
  QueryProjectDto,
  UpdateProjectDto,
} from './dto';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProjectSchema))
  async handleCreateProject(
    @Req() req: CurrentUser,
    @Body() body: CreateProjectDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.id;
    const project = await this.projectsService.createProject(userId, body);
    const message = 'Project created successfully.';
    return apiResponse(201, { data: { project }, message })(res);
  }

  @Get()
  async handleGetProjects(
    @Req() req: CurrentUser,
    @Query(new ZodValidationPipe(QueryProjectSchema)) query: QueryProjectDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.projectsService.getProjects(req.user.id, query);
    return apiResponse(200, { data })(res);
  }

  @Get(':projectId')
  async handleGetProject(
    @Req() req: CurrentUser,
    @Param('projectId') projectId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const project = await this.projectsService.getProject(
      req.user.id,
      projectId,
    );
    return apiResponse(200, { data: { project } })(res);
  }

  @Patch(':projectId')
  async handleUpdateProject(
    @Req() req: CurrentUser,
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) body: UpdateProjectDto,
    @Res() res: Response,
  ): Promise<Response> {
    const project = await this.projectsService.updateProject(
      req.user.id,
      projectId,
      body,
    );
    const message = 'Project updated successfully.';
    return apiResponse(200, { data: { project }, message })(res);
  }

  @Patch(':projectId/revoke')
  async handleRevokeProject(
    @Req() req: CurrentUser,
    @Param('projectId') projectId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const project = await this.projectsService.revokeProject(
      req.user.id,
      projectId,
    );
    const message = 'Project revoked successfully.';
    return apiResponse(200, { data: { project }, message })(res);
  }

  @Delete(':projectId')
  async handleDeleteProject(
    @Req() req: CurrentUser,
    @Param('projectId') projectId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const project = await this.projectsService.deleteProject(
      req.user.id,
      projectId,
    );
    const message = 'Project deleted successfully.';
    return apiResponse(200, { data: { project }, message })(res);
  }
}
