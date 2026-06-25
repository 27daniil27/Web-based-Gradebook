import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherSubject } from '../entities/teacher-subject.entity';
import { JournalDay } from '../entities/journal-day.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { User } from '../entities/user.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherSubject,
      JournalDay,
      JournalEntry,
      User,
      ScheduleEntry,
    ]),
  ],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
