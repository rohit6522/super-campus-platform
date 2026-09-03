import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, default: null })
  logoUrl?: string | null;

  @Prop({ required: true, trim: true })
  industry: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop()
  description?: string;

  @Prop({ type: String, default: null })
  website?: string | null;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.index({ name: 1 });