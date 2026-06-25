import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherSubject } from '../entities/teacher-subject.entity';
import { SubjectProgramItem } from '../entities/subject-program-item.entity';
import { LabTeam } from '../entities/lab-team.entity';
import { LabTeamMember } from '../entities/lab-team-member.entity';
import { LabSubmission } from '../entities/lab-submission.entity';
import { User } from '../entities/user.entity';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherSubject,
      SubjectProgramItem,
      LabTeam,
      LabTeamMember,
      LabSubmission,
      User,
    ]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}