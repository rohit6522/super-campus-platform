import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFacultyProfileDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsMongoId()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsDateString()
  joiningDate: string;

  @IsOptional()
  @IsString()
  specialization?: string;
}