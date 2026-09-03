import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateDriveDto {
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  jobRole: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsNumber()
  @Min(0)
  packageLPA: number;

  @IsArray()
  @Type(() => String)
  requiredSkills: string[];

  @IsNumber()
  @Min(0)
  minCGPA: number;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  allowedBranches: string[];

  @IsInt()
  @Min(0)
  maxBacklogs: number;

  @IsInt()
  graduationYear: number;

  @IsDateString()
  applicationDeadline: string;
}