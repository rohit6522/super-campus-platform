import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  keyConcepts: string[];

  @Prop({ type: [String], required: true })
  importantPoints: string[];

  @Prop({ type: [{ term: String, definition: String }], default: [] })
  definitions: { term: string; definition: string }[];

  @Prop({ type: [String], default: [] })
  examples: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ studentId: 1, createdAt: -1 });