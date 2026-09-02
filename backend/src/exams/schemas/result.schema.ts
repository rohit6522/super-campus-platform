import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true })
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
  examId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId; // denormalized for fast per-subject queries

  @Prop({ required: true, min: 0 })
  marksObtained: number;

  @Prop({ required: true, min: 0 })
  maxMarks: number;

  @Prop({ type: String, default: null })
  grade?: string | null; // e.g. "A", "B+", computed on save

  @Prop({ type: Number, default: null })
  gradePoint?: number | null; // e.g. 9, 8, on a 10-point scale
}

export const ResultSchema = SchemaFactory.createForClass(Result);

ResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });
ResultSchema.index({ studentId: 1, subjectId: 1 });