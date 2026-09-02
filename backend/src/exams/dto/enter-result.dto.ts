import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsMongoId, Min, ValidateNested } from 'class-validator';

class StudentResultEntry {
  @IsMongoId()
  studentId: string;

  @IsInt()
  @Min(0)
  marksObtained: number;
}

export class EnterResultDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StudentResultEntry)
  results: StudentResultEntry[];
}