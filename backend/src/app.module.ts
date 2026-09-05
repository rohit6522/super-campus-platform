// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller.js';
// import { AppService } from './app.service.js';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StudentsModule } from './students/students.module.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { TimetableModule } from './timetable/timetable.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { AssignmentsModule } from './assignments/assignments.module.js';
import { ExamsModule } from './exams/exams.module.js';
import { FacultyModule } from './faculty/faculty.module.js';
import { CompaniesModule } from './companies/companies.module.js';
import { PlacementsModule } from './placements/placements.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { AtsModule } from './ats/ats.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CodingModule } from './coding/coding.module.js';
import { AiModule } from './ai/ai.module.js';
import { AnnouncementsModule } from './announcements/announcements.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env vars available everywhere without re-importing
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    StudentsModule,
    DepartmentsModule,
    SubjectsModule,
    TimetableModule,
    AttendanceModule,
    AssignmentsModule,
    ExamsModule,
    FacultyModule,
    CompaniesModule,
    PlacementsModule,
    ResumesModule,
    AtsModule,
    AdminModule,
    CodingModule,
    AiModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}