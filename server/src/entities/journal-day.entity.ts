import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { TeacherSubject } from './teacher-subject.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('journal_days')
@Unique(['teacherSubjectId', 'date'])
export class JournalDay {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TeacherSubject, (ts) => ts.journalDays)
  teacherSubject: TeacherSubject;

  @Column()
  teacherSubjectId: number;

  @Column({ type: 'text' })
  date: string;

  @OneToMany(() => JournalEntry, (e) => e.journalDay, { cascade: true })
  entries: JournalEntry[];
}
