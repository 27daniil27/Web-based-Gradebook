import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { AttendanceStatus } from '../../common/enums';

export class AddJournalDayDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;
}

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendance?: AttendanceStatus;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(5)
  grade?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  lateMinutes?: number | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  arrivalTime?: string;
}
