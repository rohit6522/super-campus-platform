import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsInt()
  @Min(1)
  credits: number;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsMongoId()
  departmentId: string;

  @IsOptional()
  @IsMongoId()
  facultyId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}