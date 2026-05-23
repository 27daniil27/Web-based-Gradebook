import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subject, (s) => s.lessons, { onDelete: 'CASCADE' })
  subject: Subject;

  @ManyToOne(() => Group, (g) => g.lessons, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  teacher: User;

  @Column({ name: 'lesson_type' })
  lessonType: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  topic: string;
}

