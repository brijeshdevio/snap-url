import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards';
import { apiResponse } from '../utils';
import { UsersService } from './users.service';
import type { Response } from 'express';
import type { CurrentUser } from '../types';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async handleGetMe(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = req.user.id;
    const user = await this.usersService.getMe(userId);
    return apiResponse(200, { data: { user } })(res);
  }
}
