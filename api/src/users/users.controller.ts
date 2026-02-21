import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import { apiResponse } from '../lib';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findById(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findById(userId);
    return apiResponse(200, { data: { user } });
  }
}
