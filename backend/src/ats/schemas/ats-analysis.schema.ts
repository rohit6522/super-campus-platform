import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AtsAnalysisDocument = AtsAnalysis & Document;

@Schema({ timestamps: true })
export class AtsAnalysis {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Resume', required: true })
  resumeId: Types.ObjectId;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true, min: 0, max: 100 })
  overallScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  keywordMatchScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  skillsMatchScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  experienceMatchScore: number;

  @Prop({ required: true, min: 0, max: 100 })
  educationMatchScore: number;

  @Prop({ type: [String], default: [] })
  missingKeywords: string[];

  @Prop({ type: [String], default: [] })
  formattingIssues: string[];

  @Prop({ type: [String], default: [] })
  suggestions: string[];
}

export const AtsAnalysisSchema = SchemaFactory.createForClass(AtsAnalysis);

AtsAnalysisSchema.index({ studentId: 1, createdAt: -1 });