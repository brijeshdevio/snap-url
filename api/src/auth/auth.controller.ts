import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../common/guards';
import { ZodValidationPipe } from '../common/pipes';
import { envConfig } from '../config';
import { apiResponse, setCookie } from '../utils';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from './dto';
import type { Response } from 'express';
import type { LoginDto, RegisterDto } from './dto';
import { COOKIE_NAME, EXPIRED_REFRESH_TOKEN } from '../constants';
import { FindOrCreateUserDto } from './auth.types';
import { RefreshTokenGuard } from './guards';
import type { CurrentUser } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(
    @Body() body: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.register(body);
    const message = 'Registered successfully';
    return apiResponse(201, { message })(res);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    setCookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, res, {
      path: '/api/auth/refresh',
      maxAge: EXPIRED_REFRESH_TOKEN,
    });
    const message = 'Logged in successfully';
    return apiResponse(200, {
      data: { user },
      rest: { accessToken, refreshToken },
      message,
    })(res);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: { [COOKIE_NAME.REFRESH_TOKEN]: string },
    @Res() res: Response,
  ): Promise<Response> {
    const { accessToken } = await this.authService.refresh(
      req[COOKIE_NAME.REFRESH_TOKEN],
    );
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    return apiResponse(200, { rest: { accessToken } })(res);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: CurrentUser,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.logout(req.user.id);
    res.clearCookie(COOKIE_NAME.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN);
    const message = 'Logged out successfully';
    return apiResponse(200, { message })(res);
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  async githubCallback(
    @Req() req: { user: FindOrCreateUserDto },
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.findOrCreateUser(req?.user);
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    res.redirect(envConfig.FRONTEND_URL + '/dashboard');
  }
}
