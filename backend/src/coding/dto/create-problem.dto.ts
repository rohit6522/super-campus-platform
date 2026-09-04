import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Difficulty, Topic } from '../schemas/coding-problem.schema.js';

class TestCaseDto {
  @IsNotEmpty() @IsString() input: string;
  @IsNotEmpty() @IsString() expectedOutput: string;
  @IsOptional() isHidden?: boolean;
}

export class CreateProblemDto {
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsString() description: string;
  @IsEnum(Difficulty) difficulty: Difficulty;

  @IsArray() @ArrayMinSize(1) @IsEnum(Topic, { each: true })
  topics: Topic[];

  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => TestCaseDto)
  testCases: TestCaseDto[];

  @IsOptional() @IsString() starterCode?: string;

  @IsInt() @Min(1) points: number;
}