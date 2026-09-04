import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class SubmitQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  selectedAnswers: number[];
}