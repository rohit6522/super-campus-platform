import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam.schema.js';
import { Result, ResultSchema } from './schemas/result.schema.js';
import { SemesterResult, SemesterResultSchema } from './schemas/semester-result.schema.js';
import { ExamsService } from './exams.service.js';
import { ExamsController } from './exams.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';
import { SubjectsModule } from '../subjects/subjects.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exam.name, schema: ExamSchema },
      { name: Result.name, schema: ResultSchema },
      { name: SemesterResult.name, schema: SemesterResultSchema },
    ]),
    AuthModule,
    StudentsModule,
    SubjectsModule,
  ],
  providers: [ExamsService],
  controllers: [ExamsController],
  exports: [MongooseModule, ExamsService],
})
export class ExamsModule {}