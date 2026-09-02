import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SemesterResultDocument = SemesterResult & Document;

@Schema({ timestamps: true })
export class SemesterResult {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ required: true })
  sgpa: number;

  @Prop({ required: true })
  totalCredits: number;

  @Prop({ required: true })
  earnedCredits: number;
}

export const SemesterResultSchema = SchemaFactory.createForClass(SemesterResult);

SemesterResultSchema.index({ studentId: 1, semester: 1 }, { unique: true });