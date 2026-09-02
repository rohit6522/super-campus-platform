import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code: string; // e.g. "CS301"

  @Prop({ required: true, min: 1 })
  credits: number;

  @Prop({ required: true, min: 1, max: 8 })
  semester: number;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  facultyId?: Types.ObjectId | null; // assigned faculty (User with role FACULTY)

  @Prop()
  description?: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// Fast lookups: "all subjects for department X, semester Y"
SubjectSchema.index({ departmentId: 1, semester: 1 });