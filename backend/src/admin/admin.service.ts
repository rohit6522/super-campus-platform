import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema.js';
import { Student } from '../students/schemas/student.schema.js';
import { Faculty } from '../faculty/schemas/faculty.schema.js';
import { Department } from '../departments/schemas/department.schema.js';
import { Company } from '../companies/schemas/company.schema.js';
import { PlacementDrive } from '../placements/schemas/placement-drive.schema.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<any>,
    @InjectModel(Student.name) private studentModel: Model<any>,
    @InjectModel(Faculty.name) private facultyModel: Model<any>,
    @InjectModel(Department.name) private departmentModel: Model<any>,
    @InjectModel(Company.name) private companyModel: Model<any>,
    @InjectModel(PlacementDrive.name) private driveModel: Model<any>,
  ) {}


  async getOverviewStats() {
    const [totalStudents, totalFaculty, totalDepartments, totalCompanies, activeDrives, totalUsers] =
      await Promise.all([
        this.studentModel.countDocuments(),
        this.facultyModel.countDocuments(),
        this.departmentModel.countDocuments(),
        this.companyModel.countDocuments(),
        this.driveModel.countDocuments({ status: 'OPEN' }),
        this.userModel.countDocuments(),
      ]);


      
    return {
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCompanies,
      activeDrives,
      totalUsers,
    };
  }


  async getDepartmentStats(departmentId: string) {
    const [totalStudents, totalFaculty] = await Promise.all([
      this.studentModel.countDocuments({ departmentId }),
      this.facultyModel.countDocuments({ departmentId }),
    ]);

    const students = await this.studentModel.find({ departmentId }).exec();
    const avgCGPA =
      students.length > 0
        ? Math.round((students.reduce((sum, s) => sum + s.currentCGPA, 0) / students.length) * 100) / 100
        : 0;
    const avgAttendance =
      students.length > 0
        ? Math.round(
            (students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length) * 100,
          ) / 100
        : 0;

    return {
      totalStudents,
      totalFaculty,
      averageCGPA: avgCGPA,
      averageAttendance: avgAttendance,
    };
  }
}