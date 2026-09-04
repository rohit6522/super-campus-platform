import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodingProblem, CodingProblemSchema } from './schemas/coding-problem.schema.js';
import { CodingSubmission, CodingSubmissionSchema } from './schemas/coding-submission.schema.js';
import { CodingService } from './coding.service.js';
import { CodingController } from './coding.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';
import { MockCodeExecutor } from './execution/mock-code-executor.js';
import { CODE_EXECUTOR } from './execution/code-executor.token.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CodingProblem.name, schema: CodingProblemSchema },
      { name: CodingSubmission.name, schema: CodingSubmissionSchema },
    ]),
    AuthModule,
    StudentsModule,
  ],
  providers: [
    CodingService,
    { provide: CODE_EXECUTOR, useClass: MockCodeExecutor },
  ],
  controllers: [CodingController],
  exports: [MongooseModule, CodingService],
})
export class CodingModule {}