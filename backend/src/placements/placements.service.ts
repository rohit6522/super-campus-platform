import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlacementDrive, PlacementDriveDocument } from './schemas/placement-drive.schema.js';
import { Application, ApplicationDocument, ApplicationStatus } from './schemas/application.schema.js';
import { CreateDriveDto } from './dto/create-drive.dto.js';
import { checkEligibility, EligibilityResult } from './utils/eligibility.util.js';
import { Student, StudentDocument } from '../students/schemas/student.schema.js';
import { Department, DepartmentDocument } from '../departments/schemas/department.schema.js';

@Injectable()
export class PlacementsService {
  constructor(
    @InjectModel(PlacementDrive.name) private driveModel: Model<PlacementDriveDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
  ) {}

  async createDrive(dto: CreateDriveDto): Promise<PlacementDriveDocument> {
    const drive = new this.driveModel(dto);
    return drive.save();
  }

  async findAllDrives() {
    return this.driveModel
      .find()
      .populate('companyId', 'name logoUrl industry location')
      .sort({ applicationDeadline: 1 })
      .exec();
  }

  async findDrive(id: string): Promise<PlacementDriveDocument> {
    const drive = await this.driveModel
      .findById(id)
      .populate('companyId', 'name logoUrl industry location website')
      .exec();
    if (!drive) throw new NotFoundException('Placement drive not found');
    return drive;
  }

  async checkStudentEligibility(driveId: string, studentId: string): Promise<EligibilityResult> {
    const drive = await this.driveModel.findById(driveId);
    if (!drive) throw new NotFoundException('Placement drive not found');

    const student = await this.studentModel.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const department = await this.departmentModel.findById(student.departmentId);
    if (!department) throw new NotFoundException('Student department not found');

    return checkEligibility({
      studentCGPA: student.currentCGPA,
      studentBranchCode: department.code,
      studentBacklogs: student.backlogs,
      studentGraduationYear: student.graduationYear,
      drive: {
        minCGPA: drive.minCGPA,
        allowedBranches: drive.allowedBranches,
        maxBacklogs: drive.maxBacklogs,
        graduationYear: drive.graduationYear,
      },
    });
  }

  async apply(driveId: string, studentId: string, resumeUrl?: string): Promise<ApplicationDocument> {
    const drive = await this.driveModel.findById(driveId);
    if (!drive) throw new NotFoundException('Placement drive not found');

    if (drive.status === 'CLOSED' || new Date() > drive.applicationDeadline) {
      throw new BadRequestException('This placement drive is no longer accepting applications');
    }

    // Server-side re-check: never trust that the frontend only showed "Apply" to eligible students
    const eligibility = await this.checkStudentEligibility(driveId, studentId);
    if (!eligibility.eligible) {
      throw new BadRequestException('You are not eligible for this placement drive');
    }

    const existing = await this.applicationModel.findOne({ driveId, studentId });
    if (existing) {
      throw new ConflictException('You have already applied to this drive');
    }

    const application = new this.applicationModel({
      driveId,
      studentId,
      resumeUrl: resumeUrl ?? null,
    });
    return application.save();
  }

  async getMyApplications(studentId: string) {
    return this.applicationModel
      .find({ studentId })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId', select: 'name logoUrl industry' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getApplicationsForDrive(driveId: string) {
    return this.applicationModel
      .find({ driveId })
      .populate('studentId', 'rollNumber currentCGPA')
      .sort({ createdAt: 1 })
      .exec();
  }

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    const application = await this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true },
    );
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async getPlacementStats() {
    const totalDrives = await this.driveModel.countDocuments();
    const totalApplications = await this.applicationModel.countDocuments();
    const selectedApplications = await this.applicationModel.countDocuments({
      status: ApplicationStatus.SELECTED,
    });

    const selectedDrives = await this.applicationModel
      .find({ status: ApplicationStatus.SELECTED })
      .populate<{ driveId: PlacementDriveDocument }>('driveId')
      .exec();

    const packages = selectedDrives
      .map((a) => (a.driveId as any)?.packageLPA)
      .filter((p): p is number => typeof p === 'number');

    const averagePackage =
      packages.length > 0 ? Math.round((packages.reduce((a, b) => a + b, 0) / packages.length) * 100) / 100 : 0;
    const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;

    return {
      totalDrives,
      totalApplications,
      selectedCount: selectedApplications,
      averagePackageLPA: averagePackage,
      highestPackageLPA: highestPackage,
    };
  }
}