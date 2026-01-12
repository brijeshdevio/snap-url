import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ApiResponse } from '@/utils/api-response';
import { SignupSchema } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginSchema } from './dto/login.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { envConfig } from '@/config/env.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignupSchema))
  async handleSignup(@Body() body, @Res() res: Response): Promise<Response> {
    const user = await this.authService.signup(body);
    const message = 'User created successfully';
    return ApiResponse(201, { data: user, message })(res);
  }

  @Get('verify-email/:token')
  async handleVerifyEmail(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.verifyEmail(token);
    return ApiResponse(200, { message: 'Email verified successfully' })(res);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async handleLogin(@Body() body, @Res() res: Response): Promise<Response> {
    const rest = await this.authService.login(body);
    res.cookie('accessToken', rest.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', rest.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return ApiResponse(200, { rest })(res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async handleLogout(
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.logout(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return ApiResponse(200, { message: 'Logout successful' })(res);
  }

  @Post('refresh')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async handleRefresh(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const token = req.cookies['refreshToken'] as string;
    const rest = await this.authService.refresh(token);
    res.cookie('accessToken', rest.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', rest.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return ApiResponse(200, { rest, message: 'Refresh successful' })(res);
  }

  @Get('github')
  @UseGuards(PassportAuthGuard('github'))
  handleGithubAuth() {}

  @Get('github/callback')
  @UseGuards(PassportAuthGuard('github'))
  async handleGithubCallback(@Req() req, @Res() res: Response) {
    const rest = await this.authService.findOrCreateUser(req.user);
    res.cookie('accessToken', rest.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', rest.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(envConfig.FRONTEND_URL + '/dashboard');
  }
}
