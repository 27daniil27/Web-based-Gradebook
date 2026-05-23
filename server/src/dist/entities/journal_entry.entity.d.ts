import { Lesson } from './lesson.entity';
import { Student } from './student.entity';
export declare class JournalEntry {
    id: number;
    lesson: Lesson;
    student: Student;
    attendance: string;
    grade: number | null;
    note: string | null;
}
