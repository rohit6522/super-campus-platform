import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code: string; // e.g. "CSE", "ECE", "ME"

  @Prop()
  description?: string;

  @Prop({ type: String, default: null })
  hodUserId?: string | null; // references User._id of the HOD, set later
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);