import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AnalyzeResumeDto {
  @IsMongoId()
  resumeId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(50, { message: 'Job description seems too short to analyze meaningfully' })
  jobDescription: string;
}