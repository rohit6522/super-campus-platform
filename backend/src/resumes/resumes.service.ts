import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema.js';
import { SaveResumeDto } from './dto/save-resume.dto.js';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
  ) {}

  async create(studentId: string, dto: SaveResumeDto): Promise<ResumeDocument> {
    const resume = new this.resumeModel({ ...dto, studentId });
    return resume.save();
  }

  async findAllForStudent(studentId: string) {
    return this.resumeModel.find({ studentId }).sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string, studentId: string): Promise<ResumeDocument> {
    const resume = await this.resumeModel.findOne({ _id: id, studentId }).exec();
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async update(id: string, studentId: string, dto: SaveResumeDto): Promise<ResumeDocument> {
    const resume = await this.resumeModel
      .findOneAndUpdate({ _id: id, studentId }, dto, { new: true })
      .exec();
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async duplicate(id: string, studentId: string): Promise<ResumeDocument> {
    const original = await this.findOne(id, studentId);
    const copy = original.toObject();
    delete copy._id;
    delete (copy as any).createdAt;
    delete (copy as any).updatedAt;
    copy.title = `${copy.title} (Copy)`;

    const duplicate = new this.resumeModel(copy);
    return duplicate.save();
  }

  async remove(id: string, studentId: string): Promise<void> {
    const result = await this.resumeModel.findOneAndDelete({ _id: id, studentId }).exec();
    if (!result) throw new NotFoundException('Resume not found');
  }
}