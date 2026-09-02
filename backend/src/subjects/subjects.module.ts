import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './schemas/subject.schema.js';
import { SubjectsService } from './subjects.service.js';
import { SubjectsController } from './subjects.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    AuthModule,
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [MongooseModule, SubjectsService],
})
export class SubjectsModule {}