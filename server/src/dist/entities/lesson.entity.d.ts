import { Subject } from './subject.entity';
import { Group } from './group.entity';
import { User } from './user.entity';
export declare class Lesson {
    id: number;
    subject: Subject;
    group: Group;
    teacher: User;
    lessonType: string;
    date: string;
    topic: string;
}
