import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtGuard, ZodValidationPipe } from 'src/common';
import { apiResponse } from 'src/utils';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeySchema } from './dto';
// types
import type { Response } from 'express';
import type { CurrentUser } from 'src/types';
import type { CreateApiKeyDto } from './dto';

@Controller('keys')
@UseGuards(JwtGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateApiKeySchema))
  async handleCreateKey(
    @Req() req: CurrentUser,
    @Body() body: CreateApiKeyDto,
    @Res() res: Response,
  ): Promise<Response> {
    const apiKey = await this.apiKeysService.createKey(req.user.id, body);
    const message = 'Api Key generated successfully.';
    return apiResponse(201, { data: { apiKey }, message })(res);
  }

  @Get()
  async handleGetKeys(@Req() req: CurrentUser, @Res() res: Response) {
    const apiKeys = await this.apiKeysService.getAllKeys(req.user.id);
    return apiResponse(200, { data: { apiKeys } })(res);
  }
}
