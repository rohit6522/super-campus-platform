import { IsDateString, IsEnum, IsInt, IsMongoId, IsNotEmpty, Matches, Min, Max } from 'class-validator';
import { ExamType } from '../schemas/exam.schema.js';

export class CreateExamDto {
  @IsMongoId()
  subjectId: string;

  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsEnum(ExamType)
  examType: ExamType;

  @IsDateString()
  date: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;

  @IsNotEmpty()
  room: string;

  @IsInt()
  @Min(1)
  maxMarks: number;
}