export type UserRole = 'STUDENT' | 'TEACHER';
export type StudentStatus = 'ACTIVE' | 'NEW' | 'EXPELLED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type ProgramItemType = 'LAB' | 'THEORY' | 'PRACTICE' | 'TEST' | 'ORAL';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: StudentStatus;
  groupId: number | null;
  groupName: string | null;
}

export interface ScheduleEntry {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
  subject: { id: number; name: string };
  group: { id: number; name: string };
  teacher: { id: number; name: string };
}

export interface TeacherSubject {
  id: number;
  subject: { id: number; name: string };
  group: { id: number; name: string };
}

export interface JournalStudent {
  id: number;
  firstName: string;
  lastName: string;
  status: StudentStatus;
}

export interface JournalEntryData {
  id: number;
  studentId: number;
  attendance: AttendanceStatus;
  grade: number | null;
  lateMinutes: number | null;
}

export interface JournalDay {
  id: number;
  date: string;
  entries: JournalEntryData[];
}

export interface JournalData {
  teacherSubject: {
    id: number;
    subject: { id: number; name: string };
    group: { id: number; name: string };
  };
  students: JournalStudent[];
  days: JournalDay[];
}

export interface ProgramItem {
  id: number;
  type: ProgramItemType;
  title: string;
  description: string | null;
  deadline: string | null;
  assignmentFile: string | null;
  theoryMaterials: string | null;
  sortOrder: number;
  isTeamWork: boolean;
  teams?: { id: number; name: string | null; members: { id: number; name: string }[] }[];
}
