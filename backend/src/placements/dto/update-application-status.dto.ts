import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../schemas/application.schema.js';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}