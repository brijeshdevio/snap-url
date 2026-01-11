import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@/common/guard/auth.guard';
import { ApiResponse } from '@/utils/api-response';
import { UserService } from './user.service';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async handleGetMe(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.findMe(req.user.id);
    return ApiResponse(200, { data: user })(res);
  }

  @Patch('change-email')
  async handleChangeEmail(
    @Req() req: { user: { id: string } },
    @Body() body: ChangeEmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userService.changeEmail(req.user.id, body.email);
    return ApiResponse(200, { message: 'Email changed successfully' })(res);
  }

  @Patch('change-password')
  async handleChangePassword(
    @Req() req: { user: { id: string } },
    @Body() body: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userService.changePassword(req.user.id, body);
    return ApiResponse(200, { message: 'Password changed successfully' })(res);
  }
}
