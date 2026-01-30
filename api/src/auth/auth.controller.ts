import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes';
import { apiResponse, setCookie } from 'src/utils';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from './dto';
import type { Response } from 'express';
import type { LoginDto, RegisterDto } from './dto';
import { AuthGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async handleRegister(
    @Body() body: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.register(body);
    const message = 'Registered successfully';
    return apiResponse(201, { message })(res);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async handleLogin(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, user } = await this.authService.login(body);
    setCookie('access_token', accessToken, res);
    const message = 'Logged in successfully';
    return apiResponse(200, { data: { user }, rest: { accessToken }, message })(
      res,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  handleLogout(@Res() res: Response): Response {
    res.clearCookie('access_token');
    const message = 'Logged out successfully';
    return apiResponse(200, { message })(res);
  }
}
