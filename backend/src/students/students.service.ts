import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema.js';

export interface CreateStudentProfileInput {
  userId: string;
  rollNumber: string;
  departmentId: string;
  semester: number;
  batchYear: number;
  graduationYear: number;
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createProfile(input: CreateStudentProfileInput): Promise<StudentDocument> {
    const existing = await this.studentModel.findOne({ userId: input.userId });
    if (existing) {
      throw new ConflictException('Student profile already exists for this user');
    }

    const rollTaken = await this.studentModel.findOne({ rollNumber: input.rollNumber });
    if (rollTaken) {
      throw new ConflictException('Roll number already in use');
    }

    const student = new this.studentModel(input);
    return student.save();
  }

  async findMyProfile(userId: string): Promise<StudentDocument> {
    const student = await this.studentModel
      .findOne({ userId })
      .populate('userId', 'name email role')
      .populate('departmentId', 'name code')
      .exec();

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return student;
  }

  async findStudentIdByUserId(userId: string): Promise<string> {
    const student = await this.studentModel.findOne({ userId }).select('_id').exec();
    if (!student) {
      throw new NotFoundException('Student profile not found for this user');
    }
    return String(student._id);
  }
}