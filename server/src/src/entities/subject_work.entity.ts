import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Submission } from './submission.entity';

@Entity({ name: 'subject_works' })
export class SubjectWork {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subject, (s) => s.works, { onDelete: 'CASCADE' })
  subject: Subject;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date | null;

  @OneToMany(() => Submission, (sub) => sub.work)
  submissions: Submission[];
}

