import { IsNotEmpty, IsString } from 'class-validator';

export class AskAssistantDto {
  @IsNotEmpty()
  @IsString()
  question: string;
} 