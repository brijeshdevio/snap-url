import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators';
import { ZodValidationPipe } from '../common/pipes';
import { JwtAuthGuard } from '../common/guards';
import { MESSAGES } from '../constants';
import { apiResponse } from '../lib';
import { CreateSchema } from './schema';
import { ProjectsService } from './projects.service';
import type { CreateDto } from './projects.types';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body(new ZodValidationPipe(CreateSchema)) body: CreateDto,
  ) {
    const project = await this.projectsService.create(userId, body);
    return apiResponse(201, {
      data: { project },
      message: MESSAGES.PROJECT_CREATION_SUCCESS,
    });
  }

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.projectsService.findAll(userId);
    return apiResponse(200, { data });
  }

  @Delete(':id')
  async delete(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    await this.projectsService.delete(userId, id);
    return apiResponse(200, { message: MESSAGES.PROJECT_DELETE_SUCCESS });
  }
}
