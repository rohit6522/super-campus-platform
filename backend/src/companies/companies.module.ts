import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema.js';
import { CompaniesService } from './companies.service.js';
import { CompaniesController } from './companies.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    AuthModule,
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [MongooseModule, CompaniesService],
})
export class CompaniesModule {}