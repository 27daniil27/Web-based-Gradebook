import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { Subject } from '../entities/subject.entity';
import { TeacherSubject } from '../entities/teacher-subject.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { JournalDay } from '../entities/journal-day.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { SubjectProgramItem } from '../entities/subject-program-item.entity';
import { LabTeam } from '../entities/lab-team.entity';
import { LabTeamMember } from '../entities/lab-team-member.entity';
import { LabSubmission } from '../entities/lab-submission.entity';
import {
  UserRole,
  StudentStatus,
  AttendanceStatus,
  ProgramItemType,
  SubmissionStatus,
} from '../common/enums';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(TeacherSubject) private tsRepo: Repository<TeacherSubject>,
    @InjectRepository(ScheduleEntry) private scheduleRepo: Repository<ScheduleEntry>,
    @InjectRepository(JournalDay) private dayRepo: Repository<JournalDay>,
    @InjectRepository(JournalEntry) private entryRepo: Repository<JournalEntry>,
    @InjectRepository(SubjectProgramItem) private itemRepo: Repository<SubjectProgramItem>,
    @InjectRepository(LabTeam) private teamRepo: Repository<LabTeam>,
    @InjectRepository(LabTeamMember) private memberRepo: Repository<LabTeamMember>,
    @InjectRepository(LabSubmission) private submissionRepo: Repository<LabSubmission>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count();
    if (count > 0) return;
    await this.seed();
  }

  private async seed() {
    const hash = await bcrypt.hash('password', 10);

    const group = await this.groupRepo.save({ name: 'ИВТ-301' });
    const group2 = await this.groupRepo.save({ name: 'ИВТ-302' });

    const teacher = await this.userRepo.save({
      email: 'teacher@gradebook.ru',
      password: hash,
      firstName: 'Иван',
      lastName: 'Петров',
      role: UserRole.TEACHER,
      status: StudentStatus.ACTIVE,
    });

    const teacher2 = await this.userRepo.save({
      email: 'teacher2@gradebook.ru',
      password: hash,
      firstName: 'Мария',
      lastName: 'Сидорова',
      role: UserRole.TEACHER,
      status: StudentStatus.ACTIVE,
    });

    const students = await Promise.all(
      [
        ['Алексей', 'Иванов', StudentStatus.ACTIVE],
        ['Дмитрий', 'Смирнов', StudentStatus.ACTIVE],
        ['Елена', 'Козлова', StudentStatus.NEW],
        ['Ольга', 'Новикова', StudentStatus.ACTIVE],
        ['Сергей', 'Морозов', StudentStatus.EXPELLED],
        ['Анна', 'Волкова', StudentStatus.ACTIVE],
        ['Павел', 'Лебедев', StudentStatus.ACTIVE],
        ['Наталья', 'Соколова', StudentStatus.ACTIVE],
      ].map(([firstName, lastName, status], i) =>
        this.userRepo.save({
          email: `student${i + 1}@gradebook.ru`,
          password: hash,
          firstName,
          lastName,
          role: UserRole.STUDENT,
          status: status as StudentStatus,
          groupId: group.id,
        }),
      ),
    );

    const subjects = await Promise.all([
      this.subjectRepo.save({
        name: 'Веб-разработка',
        description: 'Современные технологии веб-разработки',
      }),
      this.subjectRepo.save({
        name: 'Базы данных',
        description: 'Проектирование и администрирование СУБД',
      }),
      this.subjectRepo.save({
        name: 'Алгоритмы',
        description: 'Алгоритмы и структуры данных',
      }),
    ]);

    const tsWeb = await this.tsRepo.save({
      teacherId: teacher.id,
      subjectId: subjects[0].id,
      groupId: group.id,
    });
    const tsDb = await this.tsRepo.save({
      teacherId: teacher2.id,
      subjectId: subjects[1].id,
      groupId: group.id,
    });
    const tsAlgo = await this.tsRepo.save({
      teacherId: teacher.id,
      subjectId: subjects[2].id,
      groupId: group2.id,
    });

    const scheduleData = [
      { subjectId: subjects[0].id, groupId: group.id, teacherId: teacher.id, dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'А-201' },
      { subjectId: subjects[0].id, groupId: group.id, teacherId: teacher.id, dayOfWeek: 3, startTime: '11:00', endTime: '12:30', room: 'А-201' },
      { subjectId: subjects[0].id, groupId: group.id, teacherId: teacher.id, dayOfWeek: 4, startTime: '08:00', endTime: '09:50', room: 'А-201' },
      { subjectId: subjects[1].id, groupId: group.id, teacherId: teacher2.id, dayOfWeek: 2, startTime: '09:00', endTime: '10:30', room: 'Б-105' },
      { subjectId: subjects[1].id, groupId: group.id, teacherId: teacher2.id, dayOfWeek: 4, startTime: '13:00', endTime: '14:30', room: 'Б-105' },
      { subjectId: subjects[2].id, groupId: group2.id, teacherId: teacher.id, dayOfWeek: 5, startTime: '10:00', endTime: '11:30', room: 'В-301' },
    ];
    await this.scheduleRepo.save(scheduleData);

    const dates = ['2026-03-03', '2026-03-05', '2026-03-10', '2026-03-12', '2026-03-17'];
    const grades = [5, 4, null, 3, 5, 4, 5, 4];
    const attendances = [
      AttendanceStatus.PRESENT,
      AttendanceStatus.LATE,
      AttendanceStatus.PRESENT,
      AttendanceStatus.ABSENT,
      AttendanceStatus.PRESENT,
      AttendanceStatus.PRESENT,
      AttendanceStatus.LATE,
      AttendanceStatus.PRESENT,
    ];

    for (const date of dates) {
      const day = await this.dayRepo.save({ teacherSubjectId: tsWeb.id, date });
      for (let i = 0; i < students.length; i++) {
        await this.entryRepo.save({
          journalDayId: day.id,
          studentId: students[i].id,
          attendance: attendances[i % attendances.length],
          grade: grades[i % grades.length],
          lateMinutes: attendances[i % attendances.length] === AttendanceStatus.LATE ? 15 : null,
        });
      }
    }

    const lab1 = await this.itemRepo.save({
      teacherSubjectId: tsWeb.id,
      type: ProgramItemType.LAB,
      title: 'Лабораторная 1: HTML/CSS',
      description: 'Вёрстка адаптивной страницы',
      deadline: '2026-03-20',
      theoryMaterials: 'https://developer.mozilla.org/ru/docs/Web/HTML',
      sortOrder: 1,
      isTeamWork: false,
    });

    const lab2 = await this.itemRepo.save({
      teacherSubjectId: tsWeb.id,
      type: ProgramItemType.LAB,
      title: 'Лабораторная 2: React SPA',
      description: 'Одностраничное приложение на React',
      deadline: '2026-04-10',
      sortOrder: 2,
      isTeamWork: true,
    });

    await this.itemRepo.save([
      { teacherSubjectId: tsWeb.id, type: ProgramItemType.THEORY, title: 'Введение в React', sortOrder: 0 },
      { teacherSubjectId: tsWeb.id, type: ProgramItemType.TEST, title: 'Контрольная 1', deadline: '2026-03-25', sortOrder: 3 },
      { teacherSubjectId: tsWeb.id, type: ProgramItemType.PRACTICE, title: 'Практика: Hooks', sortOrder: 4 },
      { teacherSubjectId: tsWeb.id, type: ProgramItemType.ORAL, title: 'Устный опрос', deadline: '2026-04-15', sortOrder: 5 },
    ]);

    const team = await this.teamRepo.save({ programItemId: lab2.id, name: 'Команда Alpha' });
    await this.memberRepo.save([
      { teamId: team.id, studentId: students[0].id },
      { teamId: team.id, studentId: students[1].id },
      { teamId: team.id, studentId: students[2].id },
    ]);

    await this.submissionRepo.save({
      programItemId: lab1.id,
      studentId: students[0].id,
      submittedAt: '2026-03-18T14:00:00.000Z',
      grade: 5,
      teacherComment: 'Отличная работа!',
      status: SubmissionStatus.GRADED,
    });

    await this.submissionRepo.save({
      programItemId: lab1.id,
      studentId: students[1].id,
      submittedAt: '2026-03-19T10:00:00.000Z',
      status: SubmissionStatus.SUBMITTED,
    });

    console.log('✅ База данных заполнена демо-данными');
    console.log('   Преподаватель: teacher@gradebook.ru / password');
    console.log('   Студент: student1@gradebook.ru / password');
  }
}
