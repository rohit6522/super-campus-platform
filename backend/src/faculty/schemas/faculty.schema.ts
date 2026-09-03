import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FacultyDocument = Faculty & Document;

@Schema({ timestamps: true })
export class Faculty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true, index: true })
  employeeId: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  designation: string; // e.g. "Assistant Professor", "Professor"

  @Prop({ required: true })
  joiningDate: Date;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ type: String, default: null })
  specialization?: string | null;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);

FacultySchema.index({ departmentId: 1 });