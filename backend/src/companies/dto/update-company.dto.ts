import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto.js';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}