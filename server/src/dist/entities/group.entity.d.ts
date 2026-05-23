import { Student } from './student.entity';
import { Lesson } from './lesson.entity';
export declare class Group {
    id: number;
    name: string;
    students: Student[];
    lessons: Lesson[];
}
