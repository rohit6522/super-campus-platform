import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId; // links back to the User (auth) record

  @Prop({ required: true, unique: true, trim: true, index: true })
  rollNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ required: true })
  batchYear: number; // year of admission, e.g. 2023

  @Prop({ required: true })
  graduationYear: number;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ type: String, default: null })
  address?: string | null;

  @Prop({ type: Number, default: 0 })
  currentCGPA: number;

  @Prop({ type: Number, default: 0 })
  attendancePercentage: number;

  @Prop({ type: Number, default: 0 })
  backlogs: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// Compound index: fast lookups when filtering students by department + semester (common query)
StudentSchema.index({ departmentId: 1, semester: 1 });