import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveResumeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  education?: any[];

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  experience?: any[];

  @IsOptional()
  @IsArray()
  projects?: any[];

  @IsOptional()
  @IsArray()
  certifications?: any[];

  @IsOptional()
  @IsArray()
  achievements?: string[];

  @IsOptional()
  @IsArray()
  languages?: string[];
}