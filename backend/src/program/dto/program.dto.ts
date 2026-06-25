import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsArray,
  Matches,
} from 'class-validator';
import { ProgramItemType } from '../../common/enums';

export class CreateProgramItemDto {
  @IsEnum(ProgramItemType)
  type: ProgramItemType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  deadline?: string;

  @IsOptional()
  @IsString()
  theoryMaterials?: string;

  @IsOptional()
  @IsBoolean()
  isTeamWork?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateProgramItemDto {
  @IsOptional()
  @IsEnum(ProgramItemType)
  type?: ProgramItemType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  theoryMaterials?: string;

  @IsOptional()
  @IsBoolean()
  isTeamWork?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  studentIds: number[];
}

export class GradeSubmissionDto {
  @IsOptional()
  @IsInt()
  grade?: number;

  @IsOptional()
  @IsString()
  teacherComment?: string;
}