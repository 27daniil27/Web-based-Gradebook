import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from '../entities';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(Entities))],
  providers: [SeedService],
})
export class SeedModule {}
