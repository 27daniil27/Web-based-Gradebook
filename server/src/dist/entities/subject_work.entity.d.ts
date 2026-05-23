import { Subject } from './subject.entity';
import { Submission } from './submission.entity';
export declare class SubjectWork {
    id: number;
    subject: Subject;
    title: string;
    description: string | null;
    deadline: Date | null;
    submissions: Submission[];
}
