import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import type { CreateApiKeyDto, UpdateApiKeyDto } from './dto';

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

  @Patch(':apiKeyId')
  async handleRenameKey(
    @Req() req: CurrentUser,
    @Param('apiKeyId') apiKeyId: string,
    @Body(new ZodValidationPipe(CreateApiKeySchema)) body: UpdateApiKeyDto,
    @Res() res: Response,
  ): Promise<Response> {
    const apiKey = await this.apiKeysService.renameKey(
      req.user.id,
      apiKeyId,
      body,
    );
    const message = 'Api Key renamed successfully.';
    return apiResponse(200, { data: { apiKey }, message })(res);
  }

  @Patch(':apiKeyId/revoke')
  async handleRevokeKey(
    @Req() req: CurrentUser,
    @Param('apiKeyId') apiKeyId: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.apiKeysService.revokeKey(req.user.id, apiKeyId);
    const message = 'Api Key revoked successfully.';
    return apiResponse(200, { message })(res);
  }

  @Delete(':apiKeyId')
  async handleDeleteKey(
    @Req() req: CurrentUser,
    @Param('apiKeyId') apiKeyId: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.apiKeysService.deleteKey(req.user.id, apiKeyId);
    const message = 'Api Key deleted successfully.';
    return apiResponse(200, { message })(res);
  }
}
