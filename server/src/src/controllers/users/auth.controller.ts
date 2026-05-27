import {
  Body,
  Controller,
  Post,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../../services/users/auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/api/auth/login')
  async getHello(
    @Req() request,
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response,
  ): Promise<{ success: boolean }> {
    try {
      this.logger.log(`${request.method} ${request.originalUrl}`);

      const tokens = await this.authService.signIn(body);

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 2,
      });

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return { success: true };
    } catch (err) {
      this.logger.warn(err);
      throw err;
    }
  }

  @Post('/api/auth/refresh')
  async refresh(
    @Req() request: any,
    @Res({ passthrough: true }) response: any,
  ): Promise<{ success: boolean }> {
    this.logger.log(`${request.method} ${request.originalUrl}`);

    const refreshToken = request.cookies['refresh_token'];

    const { accessToken } = await this.authService.refreshSession(refreshToken);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2,
    });

    return { success: true };
  }
}
