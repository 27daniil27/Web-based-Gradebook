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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProgramService } from './program.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums';
import { User } from '../entities/user.entity';
import {
  CreateProgramItemDto,
  UpdateProgramItemDto,
  CreateTeamDto,
  GradeSubmissionDto,
} from './dto/program.dto';

const storage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@Controller('program')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramController {
  constructor(private programService: ProgramService) {}

  @Get('subject/:teacherSubjectId')
  getStudentSubject(
    @Param('teacherSubjectId', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    return this.programService.getStudentSubject(id, req.user);
  }

  @Get('lab/:itemId')
  getLabItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Req() req: { user: User },
  ) {
    return this.programService.getLabItem(itemId, req.user);
  }

  @Get('submissions/:teacherSubjectId')
  @Roles(UserRole.TEACHER)
  getSubmissions(
    @Param('teacherSubjectId', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    return this.programService.getSubmissions(id, req.user);
  }

  @Get(':teacherSubjectId')
  getProgram(
    @Param('teacherSubjectId', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    return this.programService.getProgram(id, req.user);
  }

  @Post(':teacherSubjectId/items')
  @Roles(UserRole.TEACHER)
  createItem(
    @Param('teacherSubjectId', ParseIntPipe) id: number,
    @Body() dto: CreateProgramItemDto,
    @Req() req: { user: User },
  ) {
    return this.programService.createItem(id, dto, req.user);
  }

  @Patch('items/:itemId')
  @Roles(UserRole.TEACHER)
  updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateProgramItemDto,
    @Req() req: { user: User },
  ) {
    return this.programService.updateItem(itemId, dto, req.user);
  }

  @Post('items/:itemId/assignment')
  @Roles(UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadAssignment(
    @Param('itemId', ParseIntPipe) itemId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: User },
  ) {
    return this.programService.uploadAssignment(itemId, file, req.user);
  }

  @Post('items/:itemId/teams')
  @Roles(UserRole.TEACHER)
  createTeam(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: CreateTeamDto,
    @Req() req: { user: User },
  ) {
    return this.programService.createTeam(itemId, dto, req.user);
  }

  @Post('lab/:itemId/submit')
  @Roles(UserRole.STUDENT)
  @UseInterceptors(FileInterceptor('file', { storage }))
  submitLab(
    @Param('itemId', ParseIntPipe) itemId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: User },
  ) {
    return this.programService.submitLab(itemId, file, req.user);
  }

  @Patch('submissions/:submissionId/grade')
  @Roles(UserRole.TEACHER)
  gradeSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() dto: GradeSubmissionDto,
    @Req() req: { user: User },
  ) {
    return this.programService.gradeSubmission(submissionId, dto, req.user);
  }
}