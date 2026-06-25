import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherSubject } from '../entities/teacher-subject.entity';
import { JournalDay } from '../entities/journal-day.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { User } from '../entities/user.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { AttendanceStatus, UserRole } from '../common/enums';
import { AddJournalDayDto, UpdateJournalEntryDto } from './dto/journal.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(TeacherSubject)
    private tsRepo: Repository<TeacherSubject>,
    @InjectRepository(JournalDay)
    private dayRepo: Repository<JournalDay>,
    @InjectRepository(JournalEntry)
    private entryRepo: Repository<JournalEntry>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ScheduleEntry)
    private scheduleRepo: Repository<ScheduleEntry>,
  ) {}

  async getTeacherSubjects(teacherId: number) {
    const items = await this.tsRepo.find({
      where: { teacherId },
      relations: { subject: true, group: true },
      order: { id: 'ASC' },
    });
    return items.map((ts) => ({
      id: ts.id,
      subject: { id: ts.subject.id, name: ts.subject.name },
      group: { id: ts.group.id, name: ts.group.name },
    }));
  }

  async getStudentJournal(studentId: number) {
    const student = await this.userRepo.findOne({
      where: { id: studentId },
    });
    if (!student?.groupId) return [];

    const teacherSubjects = await this.tsRepo.find({
      where: { groupId: student.groupId },
      relations: { subject: true, group: true, teacher: true },
      order: { id: 'ASC' },
    });

    const result = [];
    for (const ts of teacherSubjects) {
      const days = await this.dayRepo.find({
        where: { teacherSubjectId: ts.id },
        relations: { entries: true },
        order: { date: 'ASC' },
      });
      const myEntries = days.map((d) => {
        const entry = d.entries.find((e) => e.studentId === studentId);
        return {
          date: d.date,
          attendance: entry?.attendance ?? AttendanceStatus.PRESENT,
          grade: entry?.grade ?? null,
          lateMinutes: entry?.lateMinutes ?? null,
        };
      });
      result.push({
        teacherSubjectId: ts.id,
        subject: { id: ts.subject.id, name: ts.subject.name },
        teacher: `${ts.teacher.lastName} ${ts.teacher.firstName}`,
        entries: myEntries,
      });
    }
    return result;
  }

  async getJournal(teacherSubjectId: number, user: User) {
    const ts = await this.tsRepo.findOne({
      where: { id: teacherSubjectId },
      relations: { subject: true, group: true, teacher: true },
    });
    if (!ts) throw new NotFoundException('Предмет не найден');
    if (user.role === UserRole.TEACHER && ts.teacherId !== user.id) {
      throw new ForbiddenException();
    }
    if (user.role === UserRole.STUDENT && user.groupId !== ts.groupId) {
      throw new ForbiddenException();
    }

    const students = await this.userRepo.find({
      where: { groupId: ts.groupId, role: UserRole.STUDENT },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    const days = await this.dayRepo.find({
      where: { teacherSubjectId },
      relations: { entries: true },
      order: { date: 'ASC' },
    });

    return {
      teacherSubject: {
        id: ts.id,
        subject: { id: ts.subject.id, name: ts.subject.name },
        group: { id: ts.group.id, name: ts.group.name },
      },
      students: students.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        status: s.status,
      })),
      days: days.map((d) => ({
        id: d.id,
        date: d.date,
        entries: d.entries.map((e) => ({
          id: e.id,
          studentId: e.studentId,
          attendance: e.attendance,
          grade: e.grade,
          lateMinutes: e.lateMinutes,
        })),
      })),
    };
  }

  async addDay(teacherSubjectId: number, dto: AddJournalDayDto, user: User) {
    const ts = await this.assertTeacher(teacherSubjectId, user.id);
    const existing = await this.dayRepo.findOne({
      where: { teacherSubjectId, date: dto.date },
    });
    if (existing) throw new BadRequestException('День уже существует');

    const students = await this.userRepo.find({
      where: { groupId: ts.groupId, role: UserRole.STUDENT },
    });

    const day = this.dayRepo.create({
      teacherSubjectId,
      date: dto.date,
      entries: students.map((s) =>
        this.entryRepo.create({
          studentId: s.id,
          attendance: AttendanceStatus.PRESENT,
        }),
      ),
    });
    return this.dayRepo.save(day);
  }

  async updateEntry(
    entryId: number,
    dto: UpdateJournalEntryDto,
    user: User,
  ) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId },
      relations: { journalDay: { teacherSubject: true } },
    });
    if (!entry) throw new NotFoundException();
    if (entry.journalDay.teacherSubject.teacherId !== user.id) {
      throw new ForbiddenException();
    }

    if (dto.arrivalTime) {
      const lateMinutes = await this.calcLateMinutes(
        entry.journalDay.teacherSubject,
        entry.journalDay.date,
        dto.arrivalTime,
      );
      entry.lateMinutes = lateMinutes;
      entry.attendance =
        lateMinutes > 0 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    }

    if (dto.attendance !== undefined) entry.attendance = dto.attendance;
    if (dto.grade !== undefined) entry.grade = dto.grade;
    if (dto.lateMinutes !== undefined) {
      entry.lateMinutes = dto.lateMinutes;
      if (dto.lateMinutes !== null && dto.lateMinutes > 0) entry.attendance = AttendanceStatus.LATE;
    }

    return this.entryRepo.save(entry);
  }

  private async calcLateMinutes(
    ts: TeacherSubject,
    date: string,
    arrivalTime: string,
  ): Promise<number> {
    const dayOfWeek = new Date(date).getDay();
    const schedule = await this.scheduleRepo.findOne({
      where: {
        subjectId: ts.subjectId,
        groupId: ts.groupId,
        teacherId: ts.teacherId,
        dayOfWeek,
      },
    });
    if (!schedule) return 0;

    const [aH, aM] = arrivalTime.split(':').map(Number);
    const [sH, sM] = schedule.startTime.split(':').map(Number);
    const arrival = aH * 60 + aM;
    const start = sH * 60 + sM;
    return Math.max(0, arrival - start);
  }

  private async assertTeacher(teacherSubjectId: number, teacherId: number) {
    const ts = await this.tsRepo.findOne({ where: { id: teacherSubjectId } });
    if (!ts) throw new NotFoundException();
    if (ts.teacherId !== teacherId) throw new ForbiddenException();
    return ts;
  }
}
