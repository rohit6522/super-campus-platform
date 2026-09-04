import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  sourceType: string;

  @IsNotEmpty()
  @IsString()
  content: string; // raw text for now — PDF extraction comes in Step 36
}