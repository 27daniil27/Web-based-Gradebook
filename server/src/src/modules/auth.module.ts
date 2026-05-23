import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Добавлен ConfigService
import { User } from '../entities/user.entity';
import { AuthService } from '../services/users/auth.service';
import { AuthController } from '../controllers/users/auth.controller';
import { AuthRepository } from '../repositories/users/auth.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['src/.env', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('DB_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
