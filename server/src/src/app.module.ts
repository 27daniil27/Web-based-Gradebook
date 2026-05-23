import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthController } from './controllers/users/auth.controller';
import { Group } from './entities/group.entity';
import { JournalEntry } from './entities/journal_entry.entity';
import { Lesson } from './entities/lesson.entity';
import { Student } from './entities/student.entity';
import { SubjectWork } from './entities/subject_work.entity';
import { Subject } from './entities/subject.entity';
import { Submission } from './entities/submission.entity';
import { User } from './entities/user.entity';
import { AuthRepository } from './repositories/users/auth.repository';
import { AuthService } from './services/users/auth.service';

const entities = [
  Group,
  JournalEntry,
  Lesson,
  Student,
  Subject,
  SubjectWork,
  Submission,
  User,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['src/.env', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const port = Number(config.getOrThrow<string>('DB_PORT'));

        if (!Number.isInteger(port)) {
          throw new Error('DB_PORT must be an integer');
        }

        return {
          type: 'postgres',
          host: config.getOrThrow<string>('DB_HOST'),
          port,
          username: config.getOrThrow<string>('DB_USER'),
          password: config.getOrThrow<string>('DB_PASS'),
          database: config.getOrThrow<string>('DB_NAME'),
          entities,
          retryAttempts: 3,
          retryDelay: 1000,
          synchronize: config.get<string>('DB_SYNC') === 'true',
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AppModule {}
