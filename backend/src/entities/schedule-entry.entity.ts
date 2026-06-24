import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('schedule_entries')
export class ScheduleEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column()
  subjectId: number;

  @ManyToOne(() => Group)
  group: Group;

  @Column()
  groupId: number;

  @ManyToOne(() => User)
  teacher: User;

  @Column()
  teacherId: number;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'text' })
  startTime: string;

  @Column({ type: 'text' })
  endTime: string;

  @Column({ type: 'text', nullable: true })
  room: string | null;
}
