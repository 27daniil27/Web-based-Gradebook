import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { SubjectWork } from './subject_work.entity';
import { Student } from './student.entity';

@Entity({ name: 'submissions' })
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubjectWork, (w) => w.submissions, { onDelete: 'CASCADE' })
  work: SubjectWork;

  @ManyToOne(() => Student, (s) => s.submissions, { onDelete: 'CASCADE' })
  student: Student;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  solution_url: string | null;

  @Column({ type: 'smallint', nullable: true })
  grade: number | null;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  submitted_at: Date;
}
