import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

export enum ExamType {
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  QUIZ = 'QUIZ',
  ASSIGNMENT_BASED = 'ASSIGNMENT_BASED',
}

@Schema({ timestamps: true })
export class Exam {
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ required: true, enum: ExamType })
  examType: ExamType;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string; // "HH:mm"

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true, trim: true })
  room: string;

  @Prop({ required: true, min: 1 })
  maxMarks: number;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

ExamSchema.index({ departmentId: 1, semester: 1, date: 1 });