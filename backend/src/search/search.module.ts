import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema.js';
import { Company, CompanySchema } from '../companies/schemas/company.schema.js';
import { CodingProblem, CodingProblemSchema } from '../coding/schemas/coding-problem.schema.js';
import { Announcement, AnnouncementSchema } from '../announcements/schemas/announcement.schema.js';
import { SearchService } from './search.service.js';
import { SearchController } from './search.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: Company.name, schema: CompanySchema },
      { name: CodingProblem.name, schema: CodingProblemSchema },
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
    AuthModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}