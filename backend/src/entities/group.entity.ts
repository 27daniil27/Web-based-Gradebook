import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { TeacherSubject } from './teacher-subject.entity';
import { ScheduleEntry } from './schedule-entry.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.group)
  students: User[];

  @OneToMany(() => TeacherSubject, (ts) => ts.group)
  teacherSubjects: TeacherSubject[];

  @OneToMany(() => ScheduleEntry, (s) => s.group)
  scheduleEntries: ScheduleEntry[];
}
