import { SubjectWork } from './subject_work.entity';
import { Student } from './student.entity';
export declare class Submission {
    id: number;
    work: SubjectWork;
    student: Student;
    status: string;
    solution_url: string | null;
    grade: number | null;
    submitted_at: Date;
}
