import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSession, AttendanceSessionSchema } from './schemas/attendance-session.schema.js';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema.js';
import { AttendanceService } from './attendance.service.js';
import { AttendanceController } from './attendance.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsModule } from '../students/students.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceSession.name, schema: AttendanceSessionSchema },
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
    AuthModule,
    StudentsModule,
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports: [MongooseModule, AttendanceService],
})
export class AttendanceModule {}