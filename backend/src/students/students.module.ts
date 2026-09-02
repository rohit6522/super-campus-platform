import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema.js';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { DepartmentsModule } from '../departments/departments.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    DepartmentsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [MongooseModule, StudentsService],
})
export class StudentsModule {}