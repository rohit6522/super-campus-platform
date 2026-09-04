import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { Student, StudentSchema } from '../students/schemas/student.schema.js';
import { Faculty, FacultySchema } from '../faculty/schemas/faculty.schema.js';
import { Department, DepartmentSchema } from '../departments/schemas/department.schema.js';
import { Company, CompanySchema } from '../companies/schemas/company.schema.js';
import { PlacementDrive, PlacementDriveSchema } from '../placements/schemas/placement-drive.schema.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Company.name, schema: CompanySchema },
      { name: PlacementDrive.name, schema: PlacementDriveSchema },
    ]),
    AuthModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}