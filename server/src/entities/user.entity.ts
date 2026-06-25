import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserRole, StudentStatus } from '../common/enums';
import { Group } from './group.entity';
import { JournalEntry } from './journal-entry.entity';
import { LabSubmission } from './lab-submission.entity';
import { LabTeamMember } from './lab-team-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text' })
  role: UserRole;

  @Column({ type: 'text', default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @ManyToOne(() => Group, (group) => group.students, { nullable: true })
  group: Group | null;

  @Column({ type: 'int', nullable: true })
  groupId: number | null;

  @OneToMany(() => JournalEntry, (entry) => entry.student)
  journalEntries: JournalEntry[];

  @OneToMany(() => LabSubmission, (sub) => sub.student)
  labSubmissions: LabSubmission[];

  @OneToMany(() => LabTeamMember, (m) => m.student)
  teamMemberships: LabTeamMember[];

  @CreateDateColumn()
  createdAt: Date;

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }
}
