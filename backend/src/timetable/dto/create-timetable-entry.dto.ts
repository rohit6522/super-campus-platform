import { IsEnum, IsInt, IsMongoId, IsNotEmpty, Matches, Max, Min } from 'class-validator';
import { DayOfWeek } from '../schemas/timetable.schema.js';

export class CreateTimetableEntryDto {
  @IsMongoId()
  departmentId: string;

  @IsInt()
  @Min(1)
  @Max(8)
  semester: number;

  @IsMongoId()
  subjectId: string;

  @IsMongoId()
  facultyId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime must be in HH:mm format' })
  endTime: string;

  @IsNotEmpty()
  room: string;
}