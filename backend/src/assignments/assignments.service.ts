import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema.js';
import { Submission, SubmissionDocument, SubmissionStatus } from './schemas/submission.schema.js';
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto.js';
import { GradeSubmissionDto } from './dto/grade-submission.dto.js';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
  ) {}

  async create(facultyId: string, dto: CreateAssignmentDto): Promise<AssignmentDocument> {
    const assignment = new this.assignmentModel({ ...dto, facultyId });
    return assignment.save();
  }

  async findBySubject(subjectId: string) {
    return this.assignmentModel.find({ subjectId }).sort({ deadline: 1 }).exec();
  }

  async findOne(id: string): Promise<AssignmentDocument> {
    const assignment = await this.assignmentModel.findById(id).exec();
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async submit(
    assignmentId: string,
    studentId: string,
    dto: SubmitAssignmentDto,
  ): Promise<SubmissionDocument> {
    const assignment = await this.findOne(assignmentId);

    const now = new Date();
    const status =
      now > assignment.deadline ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;

    // upsert: allows resubmission before grading, overwrites the previous file
    const submission = await this.submissionModel.findOneAndUpdate(
      { assignmentId, studentId },
      {
        $set: {
          assignmentId,
          studentId,
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          status,
          submittedAt: now,
        },
      },
      { new: true, upsert: true },
    );

    return submission;
  }

  async getSubmissionsForAssignment(assignmentId: string) {
    return this.submissionModel
      .find({ assignmentId })
      .populate('studentId', 'rollNumber')
      .sort({ submittedAt: 1 })
      .exec();
  }

  async getMySubmissions(studentId: string) {
    return this.submissionModel
      .find({ studentId })
      .populate('assignmentId', 'title deadline maxMarks')
      .sort({ createdAt: -1 })
      .exec();
  }

  async grade(
    submissionId: string,
    facultyId: string,
    dto: GradeSubmissionDto,
  ): Promise<SubmissionDocument> {
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) throw new NotFoundException('Submission not found');

    const assignment = await this.assignmentModel.findById(submission.assignmentId);
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (assignment.facultyId.toString() !== facultyId) {
      throw new BadRequestException('You did not create this assignment');
    }

    if (dto.marksObtained > assignment.maxMarks) {
      throw new BadRequestException(
        `Marks cannot exceed maximum of ${assignment.maxMarks}`,
      );
    }

    submission.marksObtained = dto.marksObtained;
    submission.feedback = dto.feedback ?? null;
    submission.status = SubmissionStatus.GRADED;

    return submission.save();
  }
}