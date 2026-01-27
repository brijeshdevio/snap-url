import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtGuard, ZodValidationPipe } from 'src/common';
import { apiResponse, clearCookie, setCookie } from 'src/utils';
import { DAY } from 'src/constants';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { LoginSchema, RegisterSchema } from './dto';
// types
import type { Response } from 'express';
import type { CurrentUser } from 'src/types';
import type { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async handleRegister(
    @Body() body: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.authService.register(body);
    const message = 'Account created successfully.';
    return apiResponse(201, { data: { user }, message })(res);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async handleLogin(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);
    setCookie('access_token', accessToken, res);
    setCookie('refresh_token', refreshToken, res, {
      maxAge: DAY * 7,
    });
    const message = 'Logged in successfully.';
    return apiResponse(200, {
      data: { user },
      rest: { accessToken, refreshToken },
      message,
    })(res);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async handleLogout(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.logout(req.user.id, req.auth.refreshToken);
    clearCookie('refresh_token', res);
    const message = 'Logged out successfully.';
    return apiResponse(200, { message })(res);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async handleRefresh(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken } = await this.authService.refreshToken(
      req.auth.refreshToken,
    );
    setCookie('access_token', accessToken, res);
    const message = 'Refreshed access token successfully.';
    return apiResponse(200, { rest: { accessToken }, message })(res);
  }
}
