import { Body, Controller, Post, Logger, Req } from '@nestjs/common';
import { AuthService } from '../../services/users/auth.service';
import express from 'express';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/api/auth/login')
  async getHello(
    @Req() request: express.Request,
    @Body() body: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    try {
      this.logger.log(`${request.method} ${request.originalUrl}`);
      return this.authService.signIn(body);
    }
    catch (err) {
      this.logger.warn(err);
      return Promise.reject(err);
    }
  }
}
