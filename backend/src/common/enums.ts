export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  NEW = 'NEW',
  EXPELLED = 'EXPELLED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

export enum ProgramItemType {
  LAB = 'LAB',
  THEORY = 'THEORY',
  PRACTICE = 'PRACTICE',
  TEST = 'TEST',
  ORAL = 'ORAL',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  RETURNED = 'RETURNED',
}
