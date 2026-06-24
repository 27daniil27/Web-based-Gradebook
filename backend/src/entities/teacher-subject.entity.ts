import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Subject } from './subject.entity';
import { Group } from './group.entity';
import { JournalDay } from './journal-day.entity';
import { SubjectProgramItem } from './subject-program-item.entity';

@Entity('teacher_subjects')
@Unique(['teacherId', 'subjectId', 'groupId'])
export class TeacherSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  teacher: User;

  @Column()
  teacherId: number;

  @ManyToOne(() => Subject, (s) => s.teacherSubjects)
  subject: Subject;

  @Column()
  subjectId: number;

  @ManyToOne(() => Group, (g) => g.teacherSubjects)
  group: Group;

  @Column()
  groupId: number;

  @OneToMany(() => JournalDay, (d) => d.teacherSubject)
  journalDays: JournalDay[];

  @OneToMany(() => SubjectProgramItem, (p) => p.teacherSubject)
  programItems: SubjectProgramItem[];
}
