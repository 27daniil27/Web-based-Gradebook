import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { SubjectWork } from './subject_work.entity';

@Entity({ name: 'subjects' })
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Lesson, (l) => l.subject)
  lessons: Lesson[];

  @OneToMany(() => SubjectWork, (w) => w.subject)
  works: SubjectWork[];
}

