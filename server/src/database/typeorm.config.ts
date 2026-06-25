import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Entities from '../entities';

export function getTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),
    username: config.get<string>('DB_USER', 'gradebook'),
    password: config.get<string>('DB_PASSWORD', 'gradebook'),
    database: config.get<string>('DB_NAME', 'gradebook'),
    entities: Object.values(Entities),
    synchronize: true,
    logging: config.get<string>('NODE_ENV') === 'development',
  };
}
