import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceSessionDocument = AttendanceSession & Document;

@Schema({ timestamps: true })
export class AttendanceSession {
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  facultyId: Types.ObjectId; // who created/took this session

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  isFinalized: boolean; // true once faculty submits marks (prevents further edits, unless explicitly reopened)
}

export const AttendanceSessionSchema = SchemaFactory.createForClass(AttendanceSession);

AttendanceSessionSchema.index({ subjectId: 1, date: 1 });
AttendanceSessionSchema.index({ facultyId: 1, date: 1 });