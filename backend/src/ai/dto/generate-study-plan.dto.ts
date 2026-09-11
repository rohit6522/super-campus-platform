import { IsArray, IsInt, IsMongoId, Max, Min } from 'class-validator';

export class GenerateStudyPlanDto {
  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsInt()
  @Min(1)
  @Max(16)
  availableHoursPerDay: number;

  @IsArray()
  weakTopics: string[];
}