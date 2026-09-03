import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AtsAnalysis, AtsAnalysisSchema } from './schemas/ats-analysis.schema.js';
import { AtsService } from './ats.service.js';
import { AtsController } from './ats.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';
import { ResumesModule } from '../resumes/resumes.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AtsAnalysis.name, schema: AtsAnalysisSchema }]),
    AuthModule,
    StudentsModule,
    ResumesModule,
  ],
  providers: [AtsService],
  controllers: [AtsController],
  exports: [MongooseModule, AtsService],
})
export class AtsModule {}