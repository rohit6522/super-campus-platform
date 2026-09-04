import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SubmitCodeDto {
  @IsMongoId()
  problemId: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}