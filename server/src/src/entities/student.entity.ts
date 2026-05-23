import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';
import { JournalEntry } from './journal_entry.entity';
import { Submission } from './submission.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (g) => g.students, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group | null;

  @OneToMany(() => JournalEntry, (je) => je.student)
  journalEntries: JournalEntry[];

  @OneToMany(() => Submission, (s) => s.student)
  submissions: Submission[];
}

