import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimetableDocument = TimetableEntry & Document;

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

@Schema({ timestamps: true })
export class TimetableEntry {
  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  facultyId: Types.ObjectId;

  @Prop({ required: true, enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @Prop({ required: true })
  startTime: string; // "09:00" 24hr format

  @Prop({ required: true })
  endTime: string; // "10:00"

  @Prop({ required: true, trim: true })
  room: string;
}

export const TimetableSchema = SchemaFactory.createForClass(TimetableEntry);

// Fast lookups: "timetable for department X, semester Y" (student's main query)
TimetableSchema.index({ departmentId: 1, semester: 1, dayOfWeek: 1 });
// Fast lookups: "faculty's own timetable"
TimetableSchema.index({ facultyId: 1, dayOfWeek: 1 });