import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'PlacementDrive', required: true })
  driveId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @Prop({ type: String, default: null })
  resumeUrl?: string | null;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// One application per student per drive — prevents duplicate applications
ApplicationSchema.index({ driveId: 1, studentId: 1 }, { unique: true });