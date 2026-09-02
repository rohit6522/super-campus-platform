import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsMongoId, ValidateNested } from 'class-validator';
import { AttendanceStatus } from '../schemas/attendance.schema.js';

class StudentAttendanceEntry {
  @IsMongoId()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class MarkAttendanceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceEntry)
  records: StudentAttendanceEntry[];
}