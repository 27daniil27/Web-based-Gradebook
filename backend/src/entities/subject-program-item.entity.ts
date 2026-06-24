import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProgramItemType } from '../common/enums';
import { TeacherSubject } from './teacher-subject.entity';
import { LabTeam } from './lab-team.entity';
import { LabSubmission } from './lab-submission.entity';

@Entity('subject_program_items')
export class SubjectProgramItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TeacherSubject, (ts) => ts.programItems)
  teacherSubject: TeacherSubject;

  @Column()
  teacherSubjectId: number;

  @Column({ type: 'text' })
  type: ProgramItemType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  deadline: string | null;

  @Column({ type: 'text', nullable: true })
  assignmentFile: string | null;

  @Column({ type: 'text', nullable: true })
  theoryMaterials: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isTeamWork: boolean;

  @OneToMany(() => LabTeam, (t) => t.programItem)
  teams: LabTeam[];

  @OneToMany(() => LabSubmission, (s) => s.programItem)
  submissions: LabSubmission[];
}
