import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { AttendanceStatus } from '../common/enums';
import { JournalDay } from './journal-day.entity';
import { User } from './user.entity';

@Entity('journal_entries')
@Unique(['journalDayId', 'studentId'])
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JournalDay, (d) => d.entries, { onDelete: 'CASCADE' })
  journalDay: JournalDay;

  @Column()
  journalDayId: number;

  @ManyToOne(() => User, (u) => u.journalEntries)
  student: User;

  @Column()
  studentId: number;

  @Column({ type: 'text', default: AttendanceStatus.PRESENT })
  attendance: AttendanceStatus;

  @Column({ type: 'int', nullable: true })
  grade: number | null;

  @Column({ type: 'int', nullable: true })
  lateMinutes: number | null;
}
