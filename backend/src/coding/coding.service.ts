import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodingProblem, CodingProblemDocument, Difficulty, Topic } from './schemas/coding-problem.schema.js';
import {
  CodingSubmission,
  CodingSubmissionDocument,
  SubmissionVerdict,
} from './schemas/coding-submission.schema.js';
import { CreateProblemDto } from './dto/create-problem.dto.js';
import { SubmitCodeDto } from './dto/submit-code.dto.js';
import type { CodeExecutor } from './execution/code-executor.interface.js';
import { CODE_EXECUTOR } from './execution/code-executor.token.js';

@Injectable()
export class CodingService {
  constructor(
    @InjectModel(CodingProblem.name) private problemModel: Model<CodingProblemDocument>,
    @InjectModel(CodingSubmission.name) private submissionModel: Model<CodingSubmissionDocument>,
    @Inject(CODE_EXECUTOR) private codeExecutor: CodeExecutor,
  ) {}

  async createProblem(dto: CreateProblemDto): Promise<CodingProblemDocument> {
    const problem = new this.problemModel(dto);
    return problem.save();
  }

  async findProblems(filters: { difficulty?: Difficulty; topic?: Topic; search?: string }) {
    const query: Record<string, unknown> = {};
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.topic) query.topics = filters.topic;
    if (filters.search) query.title = { $regex: filters.search, $options: 'i' };

    // Never expose hidden test cases in a list view
    return this.problemModel
      .find(query)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findProblem(id: string, includeHiddenTests = false): Promise<CodingProblemDocument> {
    const problem = await this.problemModel.findById(id).exec();
    if (!problem) throw new NotFoundException('Problem not found');

    if (!includeHiddenTests) {
      // Return a version with hidden test cases stripped for student-facing views
      const visible = problem.toObject();
      visible.testCases = visible.testCases.filter((tc: any) => !tc.isHidden);
      return visible as CodingProblemDocument;
    }

    return problem;
  }

  async submit(studentId: string, dto: SubmitCodeDto): Promise<CodingSubmissionDocument> {
    // Fetch the FULL problem including hidden test cases for actual evaluation
    const problem = await this.problemModel.findById(dto.problemId);
    if (!problem) throw new NotFoundException('Problem not found');

    let passedCount = 0;
    for (const testCase of problem.testCases) {
      const result = await this.codeExecutor.execute(dto.code, dto.language, testCase.input);
      if (result.passed && result.actualOutput.trim() === testCase.expectedOutput.trim()) {
        passedCount++;
      }
    }

    const totalTestCases = problem.testCases.length;
    const verdict =
      passedCount === totalTestCases ? SubmissionVerdict.ACCEPTED : SubmissionVerdict.WRONG_ANSWER;

    const submission = new this.submissionModel({
      problemId: dto.problemId,
      studentId,
      code: dto.code,
      language: dto.language,
      verdict,
      testCasesPassed: passedCount,
      totalTestCases,
    });

    return submission.save();
  }

  async getMySubmissions(studentId: string, problemId?: string) {
    const query: Record<string, unknown> = { studentId };
    if (problemId) query.problemId = problemId;

    return this.submissionModel
      .find(query)
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getMyProgress(studentId: string) {
    const submissions = await this.submissionModel
      .find({ studentId, verdict: SubmissionVerdict.ACCEPTED })
      .populate<{ problemId: CodingProblemDocument }>('problemId')
      .exec();

    const uniqueSolvedProblemIds = new Set(submissions.map((s) => String((s.problemId as any)._id)));

    const totalPoints = Array.from(uniqueSolvedProblemIds).reduce((sum, problemId) => {
      const submission = submissions.find((s) => String((s.problemId as any)._id) === problemId);
      return sum + ((submission?.problemId as any)?.points ?? 0);
    }, 0);

    return {
      problemsSolved: uniqueSolvedProblemIds.size,
      totalPoints,
    };
  }
}