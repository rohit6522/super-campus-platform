import { IsInt, IsMongoId, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateStudentProfileDto {
  @IsNotEmpty()
  rollNumber: string;

  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsInt()
  batchYear: number;

  @IsInt()
  graduationYear: number;
}