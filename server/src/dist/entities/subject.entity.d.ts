import { Lesson } from './lesson.entity';
import { SubjectWork } from './subject_work.entity';
export declare class Subject {
    id: number;
    name: string;
    lessons: Lesson[];
    works: SubjectWork[];
}
