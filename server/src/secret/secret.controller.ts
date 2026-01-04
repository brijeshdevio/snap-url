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
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ApiResponse } from '@/utils/api-response';
import { SecretService } from './secret.service';
import { CreateSecretSchema } from './dto/create-secret.dto';

@UseGuards(AuthGuard)
@Controller('secrets')
export class SecretController {
  constructor(private readonly secretService: SecretService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateSecretSchema))
  async handleCreate(
    @Req() req: { user: { id: string } },
    @Body() body,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.secretService.create(req.user.id, body);
    return ApiResponse(201, { data, message: 'Secret created successfully' })(
      res,
    );
  }

  @Get()
  async handleGetAll(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.secretService.getAll(req.user.id);
    return ApiResponse(200, { data })(res);
  }

  @Patch(':id/disable')
  async handleDisable(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.secretService.disable(req.user.id, id);
    return ApiResponse(200, { message: 'Api key disabled successfully' })(res);
  }

  @Patch(':id/enable')
  async handleEnable(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.secretService.enable(req.user.id, id);
    return ApiResponse(200, { message: 'Api key enabled successfully' })(res);
  }

  @Patch(':id/revoke')
  async handleRevoke(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.secretService.revoke(req.user.id, id);
    return ApiResponse(200, { message: 'Api key revoked successfully' })(res);
  }

  @Delete(':id')
  async handleDelete(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.secretService.delete(req.user.id, id);
    return ApiResponse(200, { message: 'Api key deleted successfully' })(res);
  }
}
