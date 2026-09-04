import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodingSubmissionDocument = CodingSubmission & Document;

export enum SubmissionVerdict {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
}

@Schema({ timestamps: true })
export class CodingSubmission {
  @Prop({ type: Types.ObjectId, ref: 'CodingProblem', required: true })
  problemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, trim: true })
  language: string; // e.g. "javascript", "python", "cpp"

  @Prop({ required: true, enum: SubmissionVerdict, default: SubmissionVerdict.PENDING })
  verdict: SubmissionVerdict;

  @Prop({ type: Number, default: 0 })
  testCasesPassed: number;

  @Prop({ type: Number, default: 0 })
  totalTestCases: number;
}

export const CodingSubmissionSchema = SchemaFactory.createForClass(CodingSubmission);

CodingSubmissionSchema.index({ studentId: 1, problemId: 1 });