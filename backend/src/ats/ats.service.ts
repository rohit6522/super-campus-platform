import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtsAnalysis, AtsAnalysisDocument } from './schemas/ats-analysis.schema.js';
import { Resume, ResumeDocument } from '../resumes/schemas/resume.schema.js';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto.js';
import { analyzeResumeAgainstJob } from './utils/ats-scoring.util.js';

@Injectable()
export class AtsService {
  constructor(
    @InjectModel(AtsAnalysis.name) private atsAnalysisModel: Model<AtsAnalysisDocument>,
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
  ) {}

  async analyze(studentId: string, dto: AnalyzeResumeDto): Promise<AtsAnalysisDocument> {
    const resume = await this.resumeModel.findOne({ _id: dto.resumeId, studentId });
    if (!resume) throw new NotFoundException('Resume not found');

    const result = analyzeResumeAgainstJob(resume, dto.jobDescription);

    const analysis = new this.atsAnalysisModel({
      studentId,
      resumeId: dto.resumeId,
      jobDescription: dto.jobDescription,
      ...result,
    });

    return analysis.save();
  }

  async getHistory(studentId: string) {
    return this.atsAnalysisModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  async getOne(id: string, studentId: string): Promise<AtsAnalysisDocument> {
    const analysis = await this.atsAnalysisModel.findOne({ _id: id, studentId }).exec();
    if (!analysis) throw new NotFoundException('Analysis not found');
    return analysis;
  }
}