import { User } from './user.entity';
import { Group } from './group.entity';
import { JournalEntry } from './journal_entry.entity';
import { Submission } from './submission.entity';
export declare class Student {
    id: number;
    user: User;
    group: Group | null;
    journalEntries: JournalEntry[];
    submissions: Submission[];
}
