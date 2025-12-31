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
import type { Response } from 'express';
import { ApiKeyService } from './api-key.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { CreateApiKeySchema } from './dto/create-api-key.dto';
import { ApiResponse } from '@/utils/api-response';
import { AuthGuard } from '@/common/guard/auth-guard';

@UseGuards(AuthGuard)
@Controller('apikeys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateApiKeySchema))
  async handleCreate(
    @Req() req: { user: { id: string } },
    @Body() body,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.apiKeyService.create(req.user.id, body);
    return ApiResponse(201, { data, message: 'Api key created successfully' })(
      res,
    );
  }

  @Get()
  async handleGetAll(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.apiKeyService.getAll(req.user.id);
    return ApiResponse(200, { data })(res);
  }

  @Patch(':id/disable')
  async handleDisable(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.apiKeyService.disable(req.user.id, id);
    return ApiResponse(200, { message: 'Api key disabled successfully' })(res);
  }

  @Patch(':id/enable')
  async handleEnable(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.apiKeyService.enable(req.user.id, id);
    return ApiResponse(200, { message: 'Api key enabled successfully' })(res);
  }

  @Delete(':id')
  async handleRevoke(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.apiKeyService.revoke(req.user.id, id);
    return ApiResponse(200, { message: 'Api key revoked successfully' })(res);
  }
}
