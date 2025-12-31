import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UploadTokenService } from './upload-token.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { type CreateTokenDto, CreateTokenSchema } from './dto/create-token.dto';
import { ApiResponse } from '@/utils/api-response';
import type { Response } from 'express';
import { AuthGuard } from '@/common/guard/auth-guard';

@UseGuards(AuthGuard)
@Controller('uploads')
export class UploadTokenController {
  constructor(private readonly uploadTokenService: UploadTokenService) {}

  @Post(':apiKey/sign')
  // @UsePipes(new ZodValidationPipe(CreateTokenSchema))
  async handleCreate(
    @Req() req: { user: { id: string } },
    @Param('apiKey') apiKey: string,
    @Body(new ZodValidationPipe(CreateTokenSchema))
    body: CreateTokenDto,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.uploadTokenService.create(
      req.user.id,
      apiKey,
      body,
    );
    return ApiResponse(201, { data })(res);
  }
}
