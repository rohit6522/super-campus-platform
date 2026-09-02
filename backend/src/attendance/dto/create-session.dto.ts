import { IsDateString, IsInt, IsMongoId, Max, Min } from 'class-validator';

export class CreateSessionDto {
  @IsMongoId()
  subjectId: string;

  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsDateString()
  date: string;
}