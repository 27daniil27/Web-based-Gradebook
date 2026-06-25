import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { TeacherSubject } from '../entities/teacher-subject.entity';
import { SubjectProgramItem } from '../entities/subject-program-item.entity';
import { LabTeam } from '../entities/lab-team.entity';
import { LabTeamMember } from '../entities/lab-team-member.entity';
import { LabSubmission } from '../entities/lab-submission.entity';
import { User } from '../entities/user.entity';
import {
  ProgramItemType,
  SubmissionStatus,
  UserRole,
} from '../common/enums';
import {
  CreateProgramItemDto,
  UpdateProgramItemDto,
  CreateTeamDto,
  GradeSubmissionDto,
} from './dto/program.dto';

@Injectable()
export class ProgramService {
  private uploadDir = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(TeacherSubject)
    private tsRepo: Repository<TeacherSubject>,
    @InjectRepository(SubjectProgramItem)
    private itemRepo: Repository<SubjectProgramItem>,
    @InjectRepository(LabTeam)
    private teamRepo: Repository<LabTeam>,
    @InjectRepository(LabTeamMember)
    private memberRepo: Repository<LabTeamMember>,
    @InjectRepository(LabSubmission)
    private submissionRepo: Repository<LabSubmission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir, { recursive: true });
  }

  async getProgram(teacherSubjectId: number, user: User) {
    await this.assertAccess(teacherSubjectId, user);
    const items = await this.itemRepo.find({
      where: { teacherSubjectId },
      relations: { teams: { members: { student: true } } },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return items.map((item) => this.mapItem(item));
  }

  async getStudentSubject(teacherSubjectId: number, user: User) {
    await this.assertAccess(teacherSubjectId, user);
    const ts = await this.tsRepo.findOne({
      where: { id: teacherSubjectId },
      relations: { subject: true, group: true, teacher: true },
    });
    if (!ts) throw new NotFoundException();

    const items = await this.itemRepo.find({
      where: { teacherSubjectId },
      relations: { teams: { members: { student: true } }, submissions: true },
      order: { sortOrder: 'ASC' },
    });

    const gradesByType: Record<string, { title: string; grade: number | null; date: string | null }[]> = {};

    for (const item of items) {
      const submission = item.submissions.find(
        (s) => s.studentId === user.id || s.team?.members?.some((m) => m.studentId === user.id),
      );
      const grade = submission?.grade ?? null;
      if (!gradesByType[item.type]) gradesByType[item.type] = [];
      gradesByType[item.type].push({
        title: item.title,
        grade,
        date: item.deadline,
      });
    }

    return {
      teacherSubject: {
        id: ts.id,
        subject: ts.subject,
        group: ts.group,
        teacher: `${ts.teacher.lastName} ${ts.teacher.firstName}`,
      },
      program: items.map((i) => this.mapItem(i)),
      gradesByType,
    };
  }

  async getLabItem(itemId: number, user: User) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: {
        teacherSubject: true,
        teams: { members: { student: true } },
        submissions: { student: true },
      },
    });
    if (!item) throw new NotFoundException();
    await this.assertAccess(item.teacherSubjectId, user);

    let teammates: { id: number; name: string }[] = [];
    let mySubmission = item.submissions.find((s) => s.studentId === user.id);

    if (item.isTeamWork) {
      const myTeam = item.teams.find((t) =>
        t.members.some((m) => m.studentId === user.id),
      );
      if (myTeam) {
        teammates = myTeam.members
          .filter((m) => m.studentId !== user.id)
          .map((m) => ({
            id: m.student.id,
            name: `${m.student.lastName} ${m.student.firstName}`,
          }));
        mySubmission =
          item.submissions.find((s) => s.teamId === myTeam.id) ?? mySubmission;
      }
    }

    return {
      ...this.mapItem(item),
      teammates,
      submission: mySubmission
        ? {
            id: mySubmission.id,
            filePath: mySubmission.filePath,
            originalFileName: mySubmission.originalFileName,
            submittedAt: mySubmission.submittedAt,
            grade: mySubmission.grade,
            teacherComment: mySubmission.teacherComment,
            status: mySubmission.status,
          }
        : null,
    };
  }

  async createItem(teacherSubjectId: number, dto: CreateProgramItemDto, user: User) {
    await this.assertTeacher(teacherSubjectId, user.id);
    const item = this.itemRepo.create({ ...dto, teacherSubjectId });
    return this.itemRepo.save(item);
  }

  async updateItem(itemId: number, dto: UpdateProgramItemDto, user: User) {
    const item = await this.getItemForTeacher(itemId, user.id);
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async uploadAssignment(itemId: number, file: Express.Multer.File, user: User) {
    const item = await this.getItemForTeacher(itemId, user.id);
    item.assignmentFile = `/uploads/${file.filename}`;
    return this.itemRepo.save(item);
  }

  async createTeam(itemId: number, dto: CreateTeamDto, user: User) {
    const item = await this.getItemForTeacher(itemId, user.id);
    if (!item.isTeamWork) throw new BadRequestException('Работа не командная');

    const team = await this.teamRepo.save(
      this.teamRepo.create({ programItemId: itemId, name: dto.name }),
    );
    for (const studentId of dto.studentIds) {
      await this.memberRepo.save(
        this.memberRepo.create({ teamId: team.id, studentId }),
      );
    }
    return team;
  }

  async getSubmissions(teacherSubjectId: number, user: User) {
    await this.assertTeacher(teacherSubjectId, user.id);
    const items = await this.itemRepo.find({
      where: { teacherSubjectId, type: ProgramItemType.LAB },
      relations: {
        submissions: {
          student: true,
          team: { members: { student: true } },
        },
      },
      order: { sortOrder: 'ASC' },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      deadline: item.deadline,
      submissions: item.submissions.map((s) => ({
        id: s.id,
        student: s.student
          ? { id: s.student.id, name: `${s.student.lastName} ${s.student.firstName}` }
          : null,
        team: s.team
          ? s.team.members.map((m) => `${m.student.lastName} ${m.student.firstName}`).join(', ')
          : null,
        filePath: s.filePath,
        originalFileName: s.originalFileName,
        submittedAt: s.submittedAt,
        grade: s.grade,
        teacherComment: s.teacherComment,
        status: s.status,
      })),
    }));
  }

  async submitLab(
    itemId: number,
    file: Express.Multer.File,
    user: User,
  ) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: { teacherSubject: true, teams: { members: true } },
    });
    if (!item) throw new NotFoundException();
    if (item.type !== ProgramItemType.LAB) throw new BadRequestException();
    await this.assertAccess(item.teacherSubjectId, user);

    let teamId: number | null = null;
    if (item.isTeamWork) {
      const team = item.teams.find((t) =>
        t.members.some((m) => m.studentId === user.id),
      );
      if (!team) throw new BadRequestException('Вы не в команде');
      teamId = team.id;
    }

    let submission = await this.submissionRepo.findOne({
      where: teamId
        ? { programItemId: itemId, teamId }
        : { programItemId: itemId, studentId: user.id },
    });

    const now = new Date().toISOString();
    if (!submission) {
      submission = this.submissionRepo.create({
        programItemId: itemId,
        studentId: teamId ? null : user.id,
        teamId,
      });
    }

    submission.filePath = `/uploads/${file.filename}`;
    submission.originalFileName = file.originalname;
    submission.submittedAt = now;
    submission.status = SubmissionStatus.SUBMITTED;
    return this.submissionRepo.save(submission);
  }

  async gradeSubmission(
    submissionId: number,
    dto: GradeSubmissionDto,
    user: User,
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: { programItem: { teacherSubject: true } },
    });
    if (!submission) throw new NotFoundException();
    await this.assertTeacher(
      submission.programItem.teacherSubjectId,
      user.id,
    );

    if (dto.grade !== undefined) submission.grade = dto.grade;
    if (dto.teacherComment !== undefined)
      submission.teacherComment = dto.teacherComment;
    submission.status = SubmissionStatus.GRADED;
    return this.submissionRepo.save(submission);
  }

  private mapItem(item: SubjectProgramItem) {
    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      deadline: item.deadline,
      assignmentFile: item.assignmentFile,
      theoryMaterials: item.theoryMaterials,
      sortOrder: item.sortOrder,
      isTeamWork: item.isTeamWork,
      teams: item.teams?.map((t) => ({
        id: t.id,
        name: t.name,
        members: t.members?.map((m) => ({
          id: m.student.id,
          name: `${m.student.lastName} ${m.student.firstName}`,
        })),
      })),
    };
  }

  private async assertAccess(teacherSubjectId: number, user: User) {
    const ts = await this.tsRepo.findOne({ where: { id: teacherSubjectId } });
    if (!ts) throw new NotFoundException();
    if (user.role === UserRole.TEACHER && ts.teacherId !== user.id) {
      throw new ForbiddenException();
    }
    if (user.role === UserRole.STUDENT && user.groupId !== ts.groupId) {
      throw new ForbiddenException();
    }
    return ts;
  }

  private async assertTeacher(teacherSubjectId: number, teacherId: number) {
    const ts = await this.assertAccess(teacherSubjectId, {
      id: teacherId,
      role: UserRole.TEACHER,
    } as User);
    if (ts.teacherId !== teacherId) throw new ForbiddenException();
    return ts;
  }

  private async getItemForTeacher(itemId: number, teacherId: number) {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: { teacherSubject: true },
    });
    if (!item) throw new NotFoundException();
    if (item.teacherSubject.teacherId !== teacherId) throw new ForbiddenException();
    return item;
  }
}
