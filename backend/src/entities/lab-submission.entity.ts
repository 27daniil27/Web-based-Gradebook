import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SubmissionStatus } from '../common/enums';
import { SubjectProgramItem } from './subject-program-item.entity';
import { User } from './user.entity';
import { LabTeam } from './lab-team.entity';

@Entity('lab_submissions')
export class LabSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubjectProgramItem, (p) => p.submissions)
  programItem: SubjectProgramItem;

  @Column()
  programItemId: number;

  @ManyToOne(() => User, (u) => u.labSubmissions, { nullable: true })
  student: User | null;

  @Column({ type: 'int', nullable: true })
  studentId: number | null;

  @ManyToOne(() => LabTeam, { nullable: true })
  team: LabTeam | null;

  @Column({ type: 'int', nullable: true })
  teamId: number | null;

  @Column({ type: 'text', nullable: true })
  filePath: string | null;

  @Column({ type: 'text', nullable: true })
  originalFileName: string | null;

  @Column({ type: 'text', nullable: true })
  submittedAt: string | null;

  @Column({ type: 'int', nullable: true })
  grade: number | null;

  @Column({ type: 'text', nullable: true })
  teacherComment: string | null;

  @Column({ type: 'text', default: SubmissionStatus.PENDING })
  status: SubmissionStatus;
}
