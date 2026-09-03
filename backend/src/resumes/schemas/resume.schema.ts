import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeDocument = Resume & Document;

@Schema({ _id: false })
class EducationEntry {
  @Prop({ required: true }) institution: string;
  @Prop({ required: true }) degree: string;
  @Prop({ type: String, default: null }) fieldOfStudy?: string | null;
  @Prop({ type: String, default: null }) startYear?: string | null;
  @Prop({ type: String, default: null }) endYear?: string | null;
  @Prop({ type: String, default: null }) grade?: string | null;
}

@Schema({ _id: false })
class ExperienceEntry {
  @Prop({ required: true }) company: string;
  @Prop({ required: true }) role: string;
  @Prop({ type: String, default: null }) startDate?: string | null;
  @Prop({ type: String, default: null }) endDate?: string | null;
  @Prop({ type: String, default: null }) description?: string | null;
}

@Schema({ _id: false })
class ProjectEntry {
  @Prop({ required: true }) title: string;
  @Prop({ type: String, default: null }) description?: string | null;
  @Prop({ type: [String], default: [] }) technologies: string[];
  @Prop({ type: String, default: null }) link?: string | null;
}

@Schema({ _id: false })
class CertificationEntry {
  @Prop({ required: true }) name: string;
  @Prop({ type: String, default: null }) issuer?: string | null;
  @Prop({ type: String, default: null }) date?: string | null;
}

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, trim: true, default: 'My Resume' })
  title: string; // lets a student maintain multiple resume versions

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ type: String, default: null })
  summary?: string | null;

  @Prop({ type: [EducationEntry], default: [] })
  education: EducationEntry[];

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [ExperienceEntry], default: [] })
  experience: ExperienceEntry[];

  @Prop({ type: [ProjectEntry], default: [] })
  projects: ProjectEntry[];

  @Prop({ type: [CertificationEntry], default: [] })
  certifications: CertificationEntry[];

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.index({ studentId: 1 });