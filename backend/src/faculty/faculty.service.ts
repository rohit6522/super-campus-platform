import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faculty, FacultyDocument } from './schemas/faculty.schema.js';
import { CreateFacultyProfileDto } from './dto/create-faculty-profile.dto.js';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<FacultyDocument>,
  ) {}

  async createProfile(
    userId: string,
    dto: CreateFacultyProfileDto,
  ): Promise<FacultyDocument> {
    const existing = await this.facultyModel.findOne({ userId });
    if (existing) {
      throw new ConflictException('Faculty profile already exists for this user');
    }

    const idTaken = await this.facultyModel.findOne({ employeeId: dto.employeeId });
    if (idTaken) {
      throw new ConflictException('Employee ID already in use');
    }

    const faculty = new this.facultyModel({ ...dto, userId });
    return faculty.save();
  }

  async findMyProfile(userId: string): Promise<FacultyDocument> {
    const faculty = await this.facultyModel
      .findOne({ userId })
      .populate('userId', 'name email role')
      .populate('departmentId', 'name code')
      .exec();

    if (!faculty) {
      throw new NotFoundException('Faculty profile not found');
    }
    return faculty;
  }

  async findAllByDepartment(departmentId: string) {
    return this.facultyModel
      .find({ departmentId })
      .populate('userId', 'name email')
      .exec();
  }
}