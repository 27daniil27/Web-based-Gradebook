import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConsoleLogger} from "@nestjs/common";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  logger: new ConsoleLogger({ timestamp: true });

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
