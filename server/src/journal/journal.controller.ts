import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { User } from '../entities/user.entity';
import { AddJournalDayDto, UpdateJournalEntryDto } from './dto/journal.dto';

@Controller('journal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Get('my')
  @Roles(UserRole.STUDENT)
  getMyJournal(@Req() req: { user: User }) {
    return this.journalService.getStudentJournal(req.user.id);
  }

  @Get('teacher-subjects')
  @Roles(UserRole.TEACHER)
  getTeacherSubjects(@Req() req: { user: User }) {
    return this.journalService.getTeacherSubjects(req.user.id);
  }

  @Get(':teacherSubjectId')
  getJournal(
    @Param('teacherSubjectId', ParseIntPipe) teacherSubjectId: number,
    @Req() req: { user: User },
  ) {
    return this.journalService.getJournal(teacherSubjectId, req.user);
  }

  @Post(':teacherSubjectId/days')
  @Roles(UserRole.TEACHER)
  addDay(
    @Param('teacherSubjectId', ParseIntPipe) teacherSubjectId: number,
    @Body() dto: AddJournalDayDto,
    @Req() req: { user: User },
  ) {
    return this.journalService.addDay(teacherSubjectId, dto, req.user);
  }

  @Patch('entries/:entryId')
  @Roles(UserRole.TEACHER)
  updateEntry(
    @Param('entryId', ParseIntPipe) entryId: number,
    @Body() dto: UpdateJournalEntryDto,
    @Req() req: { user: User },
  ) {
    return this.journalService.updateEntry(entryId, dto, req.user);
  }
}
