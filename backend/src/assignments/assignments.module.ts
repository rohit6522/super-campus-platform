import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema.js';
import { Submission, SubmissionSchema } from './schemas/submission.schema.js';
import { AssignmentsService } from './assignments.service.js';
import { AssignmentsController } from './assignments.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AuthModule,
    StudentsModule,
  ],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [MongooseModule, AssignmentsService],
})
export class AssignmentsModule {}