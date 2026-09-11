import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudyPlanDocument = StudyPlan & Document;

@Schema({ _id: false })
class DailyTask {
  @Prop({ required: true }) day: string; // e.g. "Monday" or "2026-09-15"
  @Prop({ required: true }) subject: string;
  @Prop({ required: true }) topic: string;
  @Prop({ required: true }) durationMinutes: number;
  @Prop({ required: true }) priority: string; // HIGH | MEDIUM | LOW
}

@Schema({ timestamps: true })
export class StudyPlan {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true })
  availableHoursPerDay: number;

  @Prop({ type: [String], default: [] })
  weakTopics: string[];

  @Prop({ type: [DailyTask], required: true })
  dailySchedule: DailyTask[];

  @Prop({ type: [String], required: true })
  priorityTopics: string[];

  @Prop({ required: true })
  summary: string;
}

export const StudyPlanSchema = SchemaFactory.createForClass(StudyPlan);

StudyPlanSchema.index({ studentId: 1, createdAt: -1 });