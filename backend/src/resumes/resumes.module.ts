import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schema.js';
import { ResumesService } from './resumes.service.js';
import { ResumesController } from './resumes.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    AuthModule,
    StudentsModule,
  ],
  providers: [ResumesService],
  controllers: [ResumesController],
  exports: [MongooseModule, ResumesService],
})
export class ResumesModule {}