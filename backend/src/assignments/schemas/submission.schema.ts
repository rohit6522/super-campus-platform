import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  LATE = 'LATE',
  GRADED = 'GRADED',
}

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: String, required: true })
  fileUrl: string;

  @Prop({ type: String, required: true })
  fileName: string;

  @Prop({ required: true, enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus;

  @Prop({ type: Number, default: null })
  marksObtained?: number | null;

  @Prop({ type: String, default: null })
  feedback?: string | null;

  @Prop({ required: true })
  submittedAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

// One submission per student per assignment — resubmission overwrites, doesn't duplicate
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });