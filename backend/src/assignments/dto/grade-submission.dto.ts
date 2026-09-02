import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GradeSubmissionDto {
  @IsInt()
  @Min(0)
  marksObtained: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}