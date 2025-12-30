import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@/common/guard/auth-guard';
import { ApiResponse } from '@/utils/api-response';
import { UserService } from './user.service';

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
}
