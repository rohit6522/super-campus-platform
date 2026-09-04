import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiJobDocument = AiJob & Document;

export enum AiJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum AiJobType {
  PDF_TO_NOTES = 'PDF_TO_NOTES',
  PDF_TO_MCQS = 'PDF_TO_MCQS',
}

@Schema({ timestamps: true })
export class AiJob {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, enum: AiJobType })
  type: AiJobType;

  @Prop({ required: true, enum: AiJobStatus, default: AiJobStatus.PENDING })
  status: AiJobStatus;

  @Prop({ required: true, trim: true })
  sourceFileName: string;

  @Prop({ type: String, default: null })
  errorMessage?: string | null;

  @Prop({ type: Types.ObjectId, default: null })
  resultId?: Types.ObjectId | null; // points to the Note or MCQ set once complete
}

export const AiJobSchema = SchemaFactory.createForClass(AiJob);

AiJobSchema.index({ studentId: 1, createdAt: -1 });