import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'AttendanceSession', required: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, enum: AttendanceStatus })
  status: AttendanceStatus;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId; // denormalized for fast per-subject aggregation

 @Prop({ type: Date, default: null })
markedAt?: Date | null;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// One attendance record per student per session — prevents duplicate marking
AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
// Fast lookups: "all attendance for student X in subject Y" (percentage calculation)
AttendanceSchema.index({ studentId: 1, subjectId: 1 });