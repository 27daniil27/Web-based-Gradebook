import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Student } from './student.entity';

@Entity({ name: 'journal_entries' })
@Unique(['lesson', 'student'])
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  lesson: Lesson;

  @ManyToOne(() => Student, (s) => s.journalEntries, { onDelete: 'CASCADE' })
  student: Student;

  @Column({ default: 'present' })
  attendance: string;

  @Column({ type: 'smallint', nullable: true })
  grade: number | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;
}

