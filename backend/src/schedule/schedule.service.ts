import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntry)
    private scheduleRepo: Repository<ScheduleEntry>,
  ) {}

  async getForUser(user: User) {
    const qb = this.scheduleRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.subject', 'subject')
      .leftJoinAndSelect('s.group', 'group')
      .leftJoinAndSelect('s.teacher', 'teacher')
      .orderBy('s.dayOfWeek', 'ASC')
      .addOrderBy('s.startTime', 'ASC');

    if (user.role === UserRole.TEACHER) {
      qb.where('s.teacherId = :teacherId', { teacherId: user.id });
    } else {
      qb.where('s.groupId = :groupId', { groupId: user.groupId });
    }

    const entries = await qb.getMany();
    return entries.map((e) => ({
      id: e.id,
      dayOfWeek: e.dayOfWeek,
      startTime: e.startTime,
      endTime: e.endTime,
      room: e.room,
      subject: { id: e.subject.id, name: e.subject.name },
      group: { id: e.group.id, name: e.group.name },
      teacher: {
        id: e.teacher.id,
        name: `${e.teacher.lastName} ${e.teacher.firstName}`,
      },
    }));
  }
}