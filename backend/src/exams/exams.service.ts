import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exam, ExamDocument } from './schemas/exam.schema.js';
import { Result, ResultDocument } from './schemas/result.schema.js';
import { SemesterResult, SemesterResultDocument } from './schemas/semester-result.schema.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { EnterResultDto } from './dto/enter-result.dto.js';
import { calculateGrade } from './utils/grading.util.js';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(SemesterResult.name)
    private semesterResultModel: Model<SemesterResultDocument>,
  ) {}

  async createExam(dto: CreateExamDto): Promise<ExamDocument> {
    const exam = new this.examModel(dto);
    return exam.save();
  }

  async findExamsByDepartmentAndSemester(departmentId: string, semester: number) {
    return this.examModel
      .find({ departmentId, semester })
      .populate('subjectId', 'name code')
      .sort({ date: 1 })
      .exec();
  }

  async enterResults(examId: string, dto: EnterResultDto): Promise<{ entered: number }> {
    const exam = await this.examModel.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    for (const entry of dto.results) {
      if (entry.marksObtained > exam.maxMarks) {
        throw new BadRequestException(
          `Marks for student ${entry.studentId} exceed max marks of ${exam.maxMarks}`,
        );
      }
    }

    const operations = dto.results.map((entry) => {
      const percentage = (entry.marksObtained / exam.maxMarks) * 100;
      const { grade, gradePoint } = calculateGrade(percentage);

      return {
        updateOne: {
          filter: {
            examId: new Types.ObjectId(examId),
            studentId: new Types.ObjectId(entry.studentId),
          },
          update: {
            $set: {
              examId: new Types.ObjectId(examId),
              studentId: new Types.ObjectId(entry.studentId),
              subjectId: exam.subjectId,
              marksObtained: entry.marksObtained,
              maxMarks: exam.maxMarks,
              grade,
              gradePoint,
            },
          },
          upsert: true,
        },
      };
    });

    await this.resultModel.bulkWrite(operations);
    return { entered: dto.results.length };
  }

  async getStudentResultsForSubject(studentId: string, subjectId: string) {
    return this.resultModel
      .find({ studentId, subjectId })
      .populate('examId', 'examType date')
      .exec();
  }

  async getStudentAllResults(studentId: string) {
    return this.resultModel
      .find({ studentId })
      .populate('subjectId', 'name code credits')
      .populate('examId', 'examType date')
      .exec();
  }

  // Computes and stores SGPA for a given student + semester, based on all subject results that semester
  async computeSemesterResult(
    studentId: string,
    semester: number,
    subjectResults: { subjectId: string; credits: number; gradePoint: number }[],
  ): Promise<SemesterResultDocument> {
    const totalCredits = subjectResults.reduce((sum, r) => sum + r.credits, 0);
    const weightedPoints = subjectResults.reduce(
      (sum, r) => sum + r.credits * r.gradePoint,
      0,
    );
    const sgpa = totalCredits > 0 ? Math.round((weightedPoints / totalCredits) * 100) / 100 : 0;

    const semesterResult = await this.semesterResultModel.findOneAndUpdate(
      { studentId, semester },
      { $set: { studentId, semester, sgpa, totalCredits, earnedCredits: totalCredits } },
      { new: true, upsert: true },
    );

    return semesterResult;
  }

  // CGPA = credit-weighted average of all semester SGPAs
  async computeCGPA(studentId: string): Promise<{ cgpa: number; semesterHistory: SemesterResultDocument[] }> {
    const semesterResults = await this.semesterResultModel
      .find({ studentId })
      .sort({ semester: 1 })
      .exec();

    const totalCredits = semesterResults.reduce((sum, r) => sum + r.totalCredits, 0);
    const weightedPoints = semesterResults.reduce((sum, r) => sum + r.totalCredits * r.sgpa, 0);
    const cgpa = totalCredits > 0 ? Math.round((weightedPoints / totalCredits) * 100) / 100 : 0;

    return { cgpa, semesterHistory: semesterResults };
  }
}