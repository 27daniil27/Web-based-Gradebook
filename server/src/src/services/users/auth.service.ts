import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/users/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(body: {
    email: string;
    password: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.log('Method sign in with email and password was called');
    const user: User | null = await this.authRepository.findByEmail(body.email);
    if (!user) {
      this.logger.log('User does not exist');
      throw new UnauthorizedException('User not found');
    }
    if (user.password !== body.password) {
      this.logger.log('User does not match password');
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.full_name,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });
    return { access_token, refresh_token };
  }

  async refreshSession(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      this.logger.log('Refresh token is missing');
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const accessToken = await this.jwtService.signAsync(
        {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          name: payload.name,
        },
        { expiresIn: '2h' },
      );

      return { accessToken };
    }
    catch (err) {
      this.logger.warn('Invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
