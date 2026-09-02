import { IsDateString, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  subjectId: string;

  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsDateString()
  deadline: string;

  @IsInt()
  @Min(0)
  maxMarks: number;
}