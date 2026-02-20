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
import type { Response } from 'express';
import { ZodValidationPipe } from '../common/pipes';
import { COOKIE_NAME, EXPIRED_REFRESH_TOKEN, MESSAGES } from '../constants';
import { envConfig } from '../config';
import { apiResponse, setCookie } from '../lib';
import { LoginSchema, RegisterSchema } from './schema';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards';
import type { FindOrCreateUserDto, LoginDto, RegisterDto } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() body: RegisterDto) {
    await this.authService.register(body);
    return apiResponse(201, { message: MESSAGES.USER_CREATION_SUCCESS });
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    const { accessToken, refreshToken } = await this.authService.login(body);
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    setCookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, res, {
      maxAge: EXPIRED_REFRESH_TOKEN,
    });
    return res.status(200).json({ message: MESSAGES.USER_LOGIN_SUCCESS });
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(
    @Req() req: { [COOKIE_NAME.REFRESH_TOKEN]: string },
    @Res() res: Response,
  ) {
    await this.authService.logout(req[COOKIE_NAME.REFRESH_TOKEN]);
    res.clearCookie(COOKIE_NAME.ACCESS_TOKEN);
    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN);
    return res.status(200).json({ message: MESSAGES.USER_LOGOUT_SUCCESS });
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: { [COOKIE_NAME.REFRESH_TOKEN]: string },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req[COOKIE_NAME.REFRESH_TOKEN],
    );
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    setCookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, res, {
      maxAge: EXPIRED_REFRESH_TOKEN,
    });
    return res.status(200).json({ message: MESSAGES.TOKEN_REFRESH_SUCCESS });
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
    const { accessToken, refreshToken } =
      await this.authService.findOrCreateUser(req?.user);
    setCookie(COOKIE_NAME.ACCESS_TOKEN, accessToken, res);
    setCookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, res, {
      maxAge: EXPIRED_REFRESH_TOKEN,
    });
    res.redirect(envConfig.FRONTEND_URL + '/dashboard');
  }
}
