import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Student, (s) => s.group)
  students: Student[];

  @OneToMany(() => Lesson, (l) => l.group)
  lessons: Lesson[];
}