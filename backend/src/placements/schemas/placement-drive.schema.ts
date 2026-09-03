import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlacementDriveDocument = PlacementDrive & Document;

@Schema({ timestamps: true })
export class PlacementDrive {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  jobRole: string;

  @Prop()
  jobDescription?: string;

  @Prop({ required: true, min: 0 })
  packageLPA: number; // annual package in Lakhs Per Annum

  @Prop({ type: [String], default: [] })
  requiredSkills: string[];

  @Prop({ required: true, min: 0 })
  minCGPA: number;

  @Prop({ type: [String], required: true })
  allowedBranches: string[]; // department codes, e.g. ["CSE", "ECE"]

  @Prop({ required: true, min: 0 })
  maxBacklogs: number; // maximum backlogs allowed, 0 = no backlogs permitted

  @Prop({ required: true })
  graduationYear: number; // which batch this drive targets

  @Prop({ required: true })
  applicationDeadline: Date;

  @Prop({ type: String, default: 'OPEN', enum: ['OPEN', 'CLOSED'] })
  status: string;
}

export const PlacementDriveSchema = SchemaFactory.createForClass(PlacementDrive);

PlacementDriveSchema.index({ status: 1, applicationDeadline: 1 });
PlacementDriveSchema.index({ graduationYear: 1 });