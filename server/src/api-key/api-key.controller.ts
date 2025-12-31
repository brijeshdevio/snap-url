import {
  Body,
  Controller,
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
}
