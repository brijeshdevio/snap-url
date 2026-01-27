import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common';
import { apiResponse } from 'src/utils';
import { UsersService } from './users.service';
// types
import type { Response } from 'express';
import type { CurrentUser } from 'src/types';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async handleGetProfile(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.usersService.getProfile(req.user.id);
    return apiResponse(200, { data: { user } })(res);
  }
}
