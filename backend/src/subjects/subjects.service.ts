import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(dto: CreateSubjectDto): Promise<SubjectDocument> {
    const existing = await this.subjectModel.findOne({ code: dto.code.toUpperCase() });
    if (existing) {
      throw new ConflictException('Subject code already exists');
    }
    const subject = new this.subjectModel(dto);
    return subject.save();
  }

  async findAll(filters: { departmentId?: string; semester?: number }) {
    const query: Record<string, unknown> = {};
    if (filters.departmentId) query.departmentId = filters.departmentId;
    if (filters.semester) query.semester = filters.semester;

    return this.subjectModel
      .find(query)
      .populate('departmentId', 'name code')
      .populate('facultyId', 'name email')
      .sort({ semester: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<SubjectDocument> {
    const subject = await this.subjectModel
      .findById(id)
      .populate('departmentId', 'name code')
      .populate('facultyId', 'name email')
      .exec();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: string, dto: UpdateSubjectDto): Promise<SubjectDocument> {
    const subject = await this.subjectModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Subject not found');
  }

  // Used by faculty to see their assigned subjects
  async findByFaculty(facultyId: string) {
    return this.subjectModel
      .find({ facultyId })
      .populate('departmentId', 'name code')
      .exec();
  }
}